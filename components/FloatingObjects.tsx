"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Floating geometric primitives — the "3D elements" scene
function FloatPrim({ shape, position, color, speed, rotAxis }: {
  shape: "box" | "torus" | "oct" | "cone" | "ring";
  position: [number, number, number];
  color: string;
  speed: number;
  rotAxis: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.15,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: shape === "ring",
  }), [color, shape]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed;
    ref.current.rotation.x += rotAxis[0] * 0.01;
    ref.current.rotation.y += rotAxis[1] * 0.01;
    ref.current.rotation.z += rotAxis[2] * 0.005;
  });

  const geo = useMemo(() => {
    switch (shape) {
      case "box":    return <boxGeometry args={[0.7, 0.7, 0.7]} />;
      case "torus":  return <torusGeometry args={[0.5, 0.15, 16, 50]} />;
      case "oct":    return <octahedronGeometry args={[0.6]} />;
      case "cone":   return <coneGeometry args={[0.4, 0.9, 6]} />;
      case "ring":   return <torusGeometry args={[0.6, 0.02, 8, 80]} />;
    }
  }, [shape]);

  return (
    <Float speed={0.8 + Math.random() * 0.4} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position} material={mat}>{geo}</mesh>
    </Float>
  );
}

const OBJECTS = [
  { shape: "box"   as const, position: [-5,  1.5, -6]  as [number,number,number], color: "#00ff88", speed: 1.0, rotAxis: [1, 1, 0] as [number,number,number] },
  { shape: "torus" as const, position: [ 4.5,-1,  -7]  as [number,number,number], color: "#ffffff", speed: 0.8, rotAxis: [0, 1, 1] as [number,number,number] },
  { shape: "oct"   as const, position: [-3.5,-2,  -5]  as [number,number,number], color: "#00ff88", speed: 1.2, rotAxis: [1, 0, 1] as [number,number,number] },
  { shape: "cone"  as const, position: [ 6,   2,  -8]  as [number,number,number], color: "#8888ff", speed: 0.9, rotAxis: [0, 1, 0] as [number,number,number] },
  { shape: "ring"  as const, position: [-6.5, 0.5,-6]  as [number,number,number], color: "#00ff88", speed: 0.7, rotAxis: [1, 1, 0] as [number,number,number] },
  { shape: "box"   as const, position: [ 2.5, 3,  -9]  as [number,number,number], color: "#ffffff", speed: 1.1, rotAxis: [1, 1, 1] as [number,number,number] },
  { shape: "oct"   as const, position: [-1,  -3,  -7]  as [number,number,number], color: "#ffaa00", speed: 0.9, rotAxis: [0, 0, 1] as [number,number,number] },
  { shape: "torus" as const, position: [ 7,  -2,  -6]  as [number,number,number], color: "#00ff88", speed: 1.3, rotAxis: [1, 0, 0] as [number,number,number] },
  { shape: "cone"  as const, position: [-7,  -1,  -8]  as [number,number,number], color: "#ffffff", speed: 0.6, rotAxis: [0, 1, 1] as [number,number,number] },
  { shape: "ring"  as const, position: [ 3,  -3.5,-5]  as [number,number,number], color: "#8888ff", speed: 1.0, rotAxis: [1, 1, 0] as [number,number,number] },
];

export default function FloatingObjects() {
  return (
    <>
      {OBJECTS.map((o, i) => <FloatPrim key={i} {...o} />)}
    </>
  );
}
