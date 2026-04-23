"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Procedural astronaut — helmet + torso + limbs
export default function Astronaut({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    // Subtle tumble rotation
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
  });

  const suitMat = new THREE.MeshStandardMaterial({ color: "#e8e8e8", roughness: 0.4, metalness: 0.3 });
  const helmetMat = new THREE.MeshStandardMaterial({ color: "#d0d8e0", roughness: 0.1, metalness: 0.6, transparent: true, opacity: 0.9 });
  const visorMat = new THREE.MeshStandardMaterial({ color: "#00ff88", emissive: "#00ff88", emissiveIntensity: 0.4, roughness: 0.05, metalness: 1.0 });
  const darkMat = new THREE.MeshStandardMaterial({ color: "#1a1a2e", roughness: 0.8 });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={groupRef} position={position} scale={1.4}>
        {/* Helmet (sphere) */}
        <mesh position={[0, 1.1, 0]} material={helmetMat}>
          <sphereGeometry args={[0.45, 32, 32]} />
        </mesh>
        {/* Visor (front face, gold tint) */}
        <mesh position={[0, 1.1, 0.28]} material={visorMat}>
          <sphereGeometry args={[0.32, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        </mesh>
        {/* Neck ring */}
        <mesh position={[0, 0.7, 0]} material={darkMat}>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 20]} />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 0.1, 0]} material={suitMat}>
          <boxGeometry args={[0.65, 0.75, 0.45]} />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 0.1, -0.3]} material={darkMat}>
          <boxGeometry args={[0.5, 0.55, 0.18]} />
        </mesh>
        {/* Left arm */}
        <mesh position={[-0.48, 0.15, 0]} rotation={[0, 0, 0.3]} material={suitMat}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        </mesh>
        {/* Right arm */}
        <mesh position={[0.48, 0.15, 0]} rotation={[0, 0, -0.3]} material={suitMat}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        </mesh>
        {/* Left glove */}
        <mesh position={[-0.55, -0.18, 0]} material={darkMat}>
          <sphereGeometry args={[0.13, 12, 12]} />
        </mesh>
        {/* Right glove */}
        <mesh position={[0.55, -0.18, 0]} material={darkMat}>
          <sphereGeometry args={[0.13, 12, 12]} />
        </mesh>
        {/* Left leg */}
        <mesh position={[-0.2, -0.65, 0]} material={suitMat}>
          <capsuleGeometry args={[0.13, 0.5, 8, 16]} />
        </mesh>
        {/* Right leg */}
        <mesh position={[0.2, -0.65, 0]} material={suitMat}>
          <capsuleGeometry args={[0.13, 0.5, 8, 16]} />
        </mesh>
        {/* Boots */}
        <mesh position={[-0.2, -1.0, 0.05]} material={darkMat}>
          <boxGeometry args={[0.22, 0.12, 0.35]} />
        </mesh>
        <mesh position={[0.2, -1.0, 0.05]} material={darkMat}>
          <boxGeometry args={[0.22, 0.12, 0.35]} />
        </mesh>
      </group>
    </Float>
  );
}
