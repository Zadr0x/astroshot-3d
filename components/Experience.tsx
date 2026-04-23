"use client";
import { useRef, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, ScrollControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import StarField from "./StarField";
import Astronaut from "./Astronaut";
import Planet from "./Planet";
import FloatingObjects from "./FloatingObjects";
import VideoCards from "./VideoCards";

// Smooth lerp
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Map value from one range to another, clamped
function remap(val: number, inLow: number, inHigh: number, outLow: number, outHigh: number) {
  const t = Math.max(0, Math.min(1, (val - inLow) / (inHigh - inLow)));
  return outLow + t * (outHigh - outLow);
}

// Camera + all 3D scene logic
function Scenes() {
  const scroll = useScroll();
  const { camera, scene } = useThree();
  const camZ = useRef(5);
  const camY = useRef(0);
  const camRotY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const mouseTarget = useRef({ x: 0, y: 0 });

  // Refs for scene objects visibility control
  const astronautRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Group>(null!);
  const floatRef = useRef<THREE.Group>(null!);
  const cardsRef = useRef<THREE.Group>(null!);
  const nebula1Ref = useRef<THREE.Points>(null!);

  // Mouse parallax
  if (typeof window !== "undefined") {
    window.onmousemove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  useFrame(({ clock }) => {
    const t = scroll.offset; // 0..1
    const dt = 0.06;

    // ─── Mouse parallax ───
    mouseTarget.current.x = lerp(mouseTarget.current.x, mouse.current.x, 0.04);
    mouseTarget.current.y = lerp(mouseTarget.current.y, mouse.current.y, 0.04);

    // ─── SECTION BREAKPOINTS (pages=15 means t=1 is 15 screens of scroll)
    // S0 Hero:          0.00 → 0.08
    // S1 Manifesto:     0.08 → 0.18
    // S2 Astronaut:     0.18 → 0.28
    // S3 Planet:        0.28 → 0.40
    // S4 Universe:      0.40 → 0.50
    // S5 Float objects: 0.50 → 0.60
    // S6 Services text: 0.60 → 0.72
    // S7 Clients:       0.72 → 0.82
    // S8 Work cards:    0.82 → 0.92
    // S9 CTA:           0.92 → 1.00

    // ─── Camera Z journey ─── (pulled back progressively)
    let targetZ =
      t < 0.08 ? remap(t, 0.00, 0.08, 5,  5)   : // hold close for hero
      t < 0.18 ? remap(t, 0.08, 0.18, 5, 10)   : // zoom out for manifesto
      t < 0.28 ? remap(t, 0.18, 0.28, 10, 16)  : // astronaut reveal
      t < 0.40 ? remap(t, 0.28, 0.40, 16, 22)  : // planet
      t < 0.50 ? remap(t, 0.40, 0.50, 22, 28)  : // universe
      t < 0.60 ? remap(t, 0.50, 0.60, 28, 32)  : // float objects
      t < 0.72 ? remap(t, 0.60, 0.72, 32, 36)  : // services text
      t < 0.82 ? remap(t, 0.72, 0.82, 36, 40)  : // clients
      t < 0.92 ? remap(t, 0.82, 0.92, 40, 44)  : // cards
                 remap(t, 0.92, 1.00, 44, 48);    // CTA

    camZ.current = lerp(camZ.current, targetZ, dt);
    camera.position.z = camZ.current;

    // ─── Camera Y drift (cinematic sway) ───
    const targetY = Math.sin(t * Math.PI * 3) * 0.8;
    camY.current = lerp(camY.current, targetY, 0.03);
    camera.position.y = camY.current;

    // ─── Camera X drift (slight left/right) ───
    const targetX = Math.sin(t * Math.PI * 1.5) * 0.4;
    camera.position.x = lerp(camera.position.x, targetX, 0.03);

    // ─── Mouse parallax on camera rotation ───
    camera.rotation.y = lerp(camera.rotation.y, -mouseTarget.current.x * 0.07, 0.05);
    camera.rotation.x = lerp(camera.rotation.x,  mouseTarget.current.y * 0.04, 0.05);

    // ─── Section object visibility ───
    // Astronaut: visible S2
    if (astronautRef.current) {
      const vis = remap(t, 0.18, 0.24, 0, 1) * remap(t, 0.35, 0.40, 1, 0);
      astronautRef.current.scale.setScalar(vis > 0.01 ? 1 : 0.001);
      (astronautRef.current as any).visible = vis > 0.01;
    }
    // Planet: visible S3
    if (planetRef.current) {
      const vis = remap(t, 0.28, 0.35, 0, 1) * remap(t, 0.48, 0.52, 1, 0);
      (planetRef.current as any).visible = vis > 0.01;
    }
    // Float objects: visible S5
    if (floatRef.current) {
      const vis = remap(t, 0.50, 0.56, 0, 1) * remap(t, 0.68, 0.72, 1, 0);
      (floatRef.current as any).visible = vis > 0.01;
    }
    // Work cards: visible S8
    if (cardsRef.current) {
      const vis = remap(t, 0.82, 0.88, 0, 1) * remap(t, 0.95, 0.98, 1, 0);
      (cardsRef.current as any).visible = vis > 0.01;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 8, 10]}   intensity={1.2} color="#ffffff" />
      <pointLight position={[-8, -5, 0]}   intensity={0.6} color="#00ff88" />
      <pointLight position={[0,  0, -20]}  intensity={0.8} color="#2244ff" />
      <pointLight position={[5,  5, -40]}  intensity={0.4} color="#00ff88" />

      {/* Always-on star field */}
      <StarField count={8000} />

      {/* Extra deep stars */}
      <StarField count={3000} size={0.06} range={600} />

      {/* ── S2: Astronaut ── */}
      <group ref={astronautRef}>
        <Astronaut position={[1.5, 0, -14]} />
      </group>

      {/* ── S3: Planet ── */}
      <group ref={planetRef}>
        <Planet
          position={[-1, 0.5, -20]}
          radius={2.2}
          color="#0d1b3e"
          atmosphereColor="#1a4fff"
          hasRings
          rotSpeed={0.06}
          floatSpeed={0.5}
        />
        {/* Second smaller moon */}
        <Planet
          position={[4, -1.5, -22]}
          radius={0.7}
          color="#2d1b0e"
          atmosphereColor="#ff6622"
          rotSpeed={0.15}
          floatSpeed={1.0}
        />
      </group>

      {/* ── S5: Float 3D objects ── */}
      <group ref={floatRef} position={[0, 0, -29]}>
        <FloatingObjects />
      </group>

      {/* ── S8: Oscillating work cards ── */}
      <group ref={cardsRef} position={[0, 0, -42]}>
        <VideoCards />
      </group>
    </>
  );
}

export default function Experience() {
  return (
    <ScrollControls pages={15} damping={0.1} distance={1}>
      <Scenes />
      <EffectComposer>
        <Bloom intensity={1.4} luminanceThreshold={0.12} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </ScrollControls>
  );
}
