"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import StarField from "./StarField";
import NebulaParticles from "./NebulaParticles";
import Planets from "./Planets";
import Globe from "./Globe";

// Map a value from one range to another
function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Mouse parallax tracker
function MouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  // Track mouse globally
  if (typeof window !== "undefined") {
    window.onmousemove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.04;
    target.current.y += (mouse.current.y - target.current.y) * 0.04;
    camera.rotation.y += (-target.current.x * 0.08 - camera.rotation.y) * 0.05;
    camera.rotation.x += (target.current.y * 0.04 - camera.rotation.x) * 0.05;
  });

  return null;
}

// Main scroll-driven scene
function Scenes() {
  const scroll = useScroll();
  const { camera } = useThree();
  const targetZ = useRef(3);

  useFrame(() => {
    const t = scroll.offset; // 0 → 1

    // Camera z-position driven by scroll
    // Hero: z=3 → z=8
    // Services: z=8 → z=14
    // Work: z=14 → z=18
    // About: z=18 → z=22
    // Contact: z=22 → z=26
    let newZ: number;
    if (t < 0.15) {
      newZ = mapRange(t, 0, 0.15, 3, 8);
    } else if (t < 0.4) {
      newZ = mapRange(t, 0.15, 0.4, 8, 14);
    } else if (t < 0.65) {
      newZ = mapRange(t, 0.4, 0.65, 14, 18);
    } else if (t < 0.85) {
      newZ = mapRange(t, 0.65, 0.85, 18, 22);
    } else {
      newZ = mapRange(t, 0.85, 1.0, 22, 26);
    }

    // Smooth lerp — the "float through space" feel
    targetZ.current += (newZ - targetZ.current) * 0.06;
    camera.position.z = targetZ.current;

    // Subtle Y drift
    camera.position.y +=
      (Math.sin(t * Math.PI * 2) * 0.3 - camera.position.y) * 0.03;
  });

  return (
    <>
      <MouseParallax />

      {/* Ambient + lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#00ff88" />
      <pointLight position={[0, 0, -15]} intensity={0.8} color="#0044ff" />

      {/* Star field — always visible */}
      <StarField count={6000} />

      {/* Nebula particles — visible in hero */}
      <NebulaParticles count={600} />

      {/* Services planets — positioned in mid-space */}
      <Planets />

      {/* About globe — deep space */}
      <Globe />

      {/* Contact star cluster */}
      <ContactStars />
    </>
  );
}

// Green aurora for contact section
function ContactStars() {
  const ref = useRef<THREE.Points>(null!);
  const positions = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = -22 - Math.random() * 10;
  }

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#00ff88"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 75, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    >
      <Suspense fallback={null}>
        <ScrollControls pages={8} damping={0.12} distance={1}>
          <Scenes />
        </ScrollControls>

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
