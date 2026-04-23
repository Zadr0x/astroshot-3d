"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Globe() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

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

          void main() {
            vec3 n = normalize(vNormal);
            vec3 light = normalize(vec3(3.0, 2.0, 4.0));
            float diff = max(dot(n, light), 0.0);

            // Deep ocean + land noise
            float lat = vUv.y * 3.14159 - 1.5708;
            float lon = vUv.x * 6.28318 + uTime * 0.05;
            float landNoise = sin(lat * 5.0) * cos(lon * 4.0) * 0.5 + 0.5;
            
            vec3 ocean = vec3(0.02, 0.05, 0.15);
            vec3 land = vec3(0.05, 0.18, 0.08);
            vec3 baseColor = mix(ocean, land, step(0.6, landNoise));
            baseColor = baseColor * (0.4 + diff * 0.6);

            // Fresnel atmosphere — neon green glow
            vec3 viewDir = normalize(-vPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 2.5);
            vec3 atmo = vec3(0.0, 1.0, 0.53) * fresnel * 2.5;

            gl_FragColor = vec4(baseColor + atmo, 1.0);
          }
        `,
      }),
    []
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    if (meshRef.current) meshRef.current.rotation.y = clock.elapsedTime * 0.08;
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[0, 0, -20]}>
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[2.5, 64, 64]} />
      </mesh>

      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 8, 100]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
      </mesh>

      {/* Atmosphere halo */}
      <mesh>
        <sphereGeometry args={[2.9, 32, 32]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Kuwait location dot */}
      <mesh position={[0.8, 1.2, 2.3]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
    </group>
  );
}
