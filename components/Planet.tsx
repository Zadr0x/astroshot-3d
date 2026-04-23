"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface PlanetProps {
  position?: [number, number, number];
  radius?: number;
  color?: string;
  atmosphereColor?: string;
  hasRings?: boolean;
  rotSpeed?: number;
  floatSpeed?: number;
}

export default function Planet({
  position = [0, 0, 0],
  radius = 1.8,
  color = "#1a3a6b",
  atmosphereColor = "#2255cc",
  hasRings = false,
  rotSpeed = 0.08,
  floatSpeed = 0.6,
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(color) },
      uColor2: { value: new THREE.Color(atmosphereColor) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i); float b = hash(i + vec2(1,0));
        float c = hash(i + vec2(0,1)); float d = hash(i + vec2(1,1));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec3 n = normalize(vNormal);
        vec3 light = normalize(vec3(3.0, 2.0, 5.0));
        float diff = clamp(dot(n, light), 0.0, 1.0);

        // Surface detail bands
        float band = sin(vUv.y * 12.0 + noise(vUv * 6.0 + uTime * 0.02) * 2.0) * 0.5 + 0.5;
        vec3 baseColor = mix(uColor1, uColor2 * 0.6, band);
        baseColor = baseColor * (0.25 + diff * 0.75);

        // Atmospheric Fresnel glow
        vec3 viewDir = normalize(-vWorldPos);
        float fresnel = pow(1.0 - clamp(dot(viewDir, n), 0.0, 1.0), 3.5);
        baseColor += uColor2 * fresnel * 2.0;

        gl_FragColor = vec4(baseColor, 1.0);
      }
    `,
  }), [color, atmosphereColor]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    if (meshRef.current) meshRef.current.rotation.y = clock.elapsedTime * rotSpeed;
    if (ringRef.current) ringRef.current.rotation.z = clock.elapsedTime * 0.04;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.1} floatIntensity={0.4}>
      <group position={position}>
        <mesh ref={meshRef} material={material}>
          <sphereGeometry args={[radius, 128, 128]} />
        </mesh>
        {/* Atmosphere halo */}
        <mesh>
          <sphereGeometry args={[radius * 1.12, 32, 32]} />
          <meshBasicMaterial color={atmosphereColor} transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>
        {hasRings && (
          <mesh ref={ringRef} rotation={[Math.PI / 4, 0.2, 0]}>
            <torusGeometry args={[radius * 1.7, radius * 0.08, 3, 120]} />
            <meshBasicMaterial color={atmosphereColor} transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    </Float>
  );
}
