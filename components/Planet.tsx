"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PlanetProps {
  position?: [number,number,number];
  radius?: number;
  texturePath: string;
  atmosphereColor?: string;
  hasRings?: boolean;
  ringColor?: string;
  rotSpeed?: number;
  floatSpeed?: number;
  tilt?: number;
}

export default function Planet({
  position = [0,0,0],
  radius = 2.0,
  texturePath,
  atmosphereColor = "#2255cc",
  hasRings = false,
  ringColor = "#aaaaaa",
  rotSpeed = 0.06,
  floatSpeed = 0.5,
  tilt = 0,
}: PlanetProps) {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const ringRef  = useRef<THREE.Mesh>(null!);
  const atmoRef  = useRef<THREE.Mesh>(null!);
  const texture  = useTexture(texturePath);

  // Atmosphere fresnel shader overlay
  const atmoMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(atmosphereColor) } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelViewMatrix * vec4(position,1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 viewDir = normalize(-vWorldPos);
        float fresnel = pow(1.0 - clamp(dot(viewDir, normalize(vNormal)), 0.0, 1.0), 3.0);
        gl_FragColor = vec4(uColor, fresnel * 0.9);
      }
    `,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [atmosphereColor]);

  useFrame(({ clock }) => {
    if (meshRef.current)  meshRef.current.rotation.y = clock.elapsedTime * rotSpeed;
    if (ringRef.current)  ringRef.current.rotation.z = clock.elapsedTime * 0.03;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.08} floatIntensity={0.35}>
      <group position={position} rotation={[tilt, 0, 0]}>
        {/* Planet surface */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[radius, 128, 128]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>

        {/* Atmosphere glow */}
        <mesh ref={atmoRef} scale={1.08}>
          <sphereGeometry args={[radius, 32, 32]} />
          <primitive object={atmoMat} attach="material" />
        </mesh>

        {/* Soft outer halo */}
        <mesh scale={1.18}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.04}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Rings */}
        {hasRings && (
          <mesh ref={ringRef} rotation={[Math.PI/3, 0.1, 0]}>
            <torusGeometry args={[radius*1.75, radius*0.1, 3, 180]} />
            <meshBasicMaterial color={ringColor} transparent opacity={0.55} />
          </mesh>
        )}
      </group>
    </Float>
  );
}
