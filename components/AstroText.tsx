"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

interface AstroTextProps {
  text: string;
  position?: [number, number, number];
  size?: number;
  depth?: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
}

export default function AstroText({
  text,
  position = [0, 0, 0],
  size = 1.2,
  depth = 0.15,
  color = "#ffffff",
  emissive = "#00ff88",
  emissiveIntensity = 0.3,
}: AstroTextProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle float
      groupRef.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Center>
        <Text3D
          font="/fonts/inter-bold.json"
          size={size}
          height={depth}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.015}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            roughness={0.2}
            metalness={0.6}
          />
        </Text3D>
      </Center>
    </group>
  );
}
