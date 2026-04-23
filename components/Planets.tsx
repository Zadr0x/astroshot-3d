"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// VFX Planet — warm orange-red with atmosphere glow
function VFXPlanet() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          
          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(i.z + vec4(0.0,i1.z,i2.z,1.0)) + i.y + vec4(0.0,i1.y,i2.y,1.0)) + i.x + vec4(0.0,i1.x,i2.x,1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }
          
          void main() {
            vec3 n = normalize(vNormal);
            vec3 light = normalize(vec3(2.0, 1.5, 3.0));
            float diff = max(dot(n, light), 0.0);
            
            float noise = snoise(vec3(vUv * 4.0, uTime * 0.1));
            vec3 hotColor = vec3(1.0, 0.4, 0.1);
            vec3 coolColor = vec3(0.6, 0.1, 0.05);
            vec3 baseColor = mix(coolColor, hotColor, noise * 0.5 + 0.5);
            
            vec3 viewDir = normalize(-vPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 3.0);
            vec3 atmo = vec3(1.0, 0.5, 0.1) * fresnel * 2.0;
            
            vec3 color = baseColor * (0.3 + diff * 0.7) + atmo;
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }),
    []
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    if (meshRef.current) meshRef.current.rotation.y = clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} position={[-4.5, 0.5, -8]} material={material}>
        <sphereGeometry args={[1.4, 64, 64]} />
      </mesh>
    </Float>
  );
}

// Social Planet — holographic blue grid sphere
function SocialPlanet() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.elapsedTime * 0.15;
    if (glowRef.current) {
      glowRef.current.rotation.y = -clock.elapsedTime * 0.1;
      glowRef.current.rotation.x = clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[0, -0.5, -10]}>
        {/* Core sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshStandardMaterial
            color="#0066ff"
            emissive="#0033aa"
            emissiveIntensity={0.5}
            wireframe={false}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        {/* Wireframe overlay */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.65, 16, 16]} />
          <meshBasicMaterial
            color="#00aaff"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        {/* Atmosphere glow */}
        <mesh>
          <sphereGeometry args={[1.9, 32, 32]} />
          <meshBasicMaterial
            color="#0055ff"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Branding Planet — iridescent crystal icosahedron
function BrandingPlanet() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -clock.elapsedTime * 0.2;
      innerRef.current.rotation.z = clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.3}>
      <group position={[4.5, 0, -9]}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial
            color="#8833ff"
            emissive="#440088"
            emissiveIntensity={0.6}
            roughness={0.05}
            metalness={0.9}
            wireframe={false}
          />
        </mesh>
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.35, 0]} />
          <meshBasicMaterial
            color="#aa66ff"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
        {/* Purple glow */}
        <mesh>
          <icosahedronGeometry args={[1.6, 0]} />
          <meshBasicMaterial
            color="#6600ff"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Planets() {
  return (
    <>
      <VFXPlanet />
      <SocialPlanet />
      <BrandingPlanet />
    </>
  );
}
