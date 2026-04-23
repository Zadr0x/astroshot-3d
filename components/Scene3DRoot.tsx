"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

export default function Scene3DRoot() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 70, near: 0.1, far: 2000 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh", zIndex: 0,
      }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}
