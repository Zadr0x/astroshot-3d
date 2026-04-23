"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

export default function Astronaut({ position = [0, 0, 0] as [number,number,number], scale = 1.8 }) {
  const { scene } = useGLTF("/models/astronaut.glb");
  const groupRef = useRef<THREE.Group>(null!);

  // Clone so multiple instances don't share state
  const clonedScene = scene.clone(true);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    // Slow tumble
    groupRef.current.rotation.y  =  t * 0.12;
    groupRef.current.rotation.z  =  Math.sin(t * 0.25) * 0.15;
    groupRef.current.rotation.x  =  Math.sin(t * 0.18) * 0.08;
  });

  return (
    <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.8}>
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/astronaut.glb");
