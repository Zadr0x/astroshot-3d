"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const PROJECTS = [
  { title: "Mercedes-Benz CLA", tags: "VFX · 3D · Campaign", color: "#111" },
  { title: "Gulf Bank", tags: "Social · Content", color: "#0a1628" },
  { title: "BYD Launch", tags: "VFX · Motion", color: "#0d0d0d" },
  { title: "Honda Alghanim", tags: "TikTok · Reels", color: "#111" },
  { title: "IKEA Kuwait", tags: "Content · Strategy", color: "#0a1a0a" },
  { title: "Hongqi × Astroshot", tags: "VFX · Premium", color: "#1a0a0d" },
];

// Oscillating card — shakes on sine wave, different phase per card
function OscCard({ project, index, total }: {
  project: typeof PROJECTS[0];
  index: number;
  total: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const phase = (index / total) * Math.PI * 2;
  const col = index % 3;
  const row = Math.floor(index / 3);
  const x = (col - 1) * 4.2;
  const y = (row - 0.5) * -3.0;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    // Each card oscillates independently — different freq, phase, amplitude
    groupRef.current.position.y = y + Math.sin(t * 0.6 + phase) * 0.18;
    groupRef.current.rotation.z = Math.sin(t * 0.4 + phase + 1) * 0.04;
    groupRef.current.rotation.x = Math.sin(t * 0.35 + phase + 2) * 0.025;
  });

  return (
    <group ref={groupRef} position={[x, y, 0]}>
      <Html
        transform
        occlude={false}
        style={{ width: "300px", pointerEvents: "none" }}
      >
        <div style={{
          width: "300px",
          height: "190px",
          background: project.color,
          border: "1px solid rgba(0,255,136,0.18)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "1.2rem",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,255,136,0.05)",
        }}>
          {/* Fake video gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, rgba(0,255,136,0.04) 0%, transparent 60%)`,
          }} />
          {/* Green corner accent */}
          <div style={{
            position: "absolute", top: "1rem", right: "1rem",
            width: "6px", height: "6px",
            borderRadius: "50%",
            background: "#00ff88",
            boxShadow: "0 0 8px #00ff88",
          }} />
          {/* Index */}
          <p style={{
            position: "absolute", top: "1rem", left: "1.2rem",
            fontSize: "0.6rem", letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
          }}>
            {String(index + 1).padStart(2, "0")}
          </p>
          {/* Title */}
          <p style={{
            fontSize: "1rem", fontWeight: 700,
            color: "#f0f0f0", lineHeight: 1.2,
            marginBottom: "0.4rem",
            fontFamily: "var(--font-space, sans-serif)",
          }}>{project.title}</p>
          {/* Tags */}
          <p style={{
            fontSize: "0.65rem", letterSpacing: "0.15em",
            color: "#00ff88", textTransform: "uppercase",
          }}>{project.tags}</p>
        </div>
      </Html>
    </group>
  );
}

export default function VideoCards({ z = 0 }: { z?: number }) {
  return (
    <group position={[0, 0, z]}>
      {PROJECTS.map((p, i) => (
        <OscCard key={i} project={p} index={i} total={PROJECTS.length} />
      ))}
    </group>
  );
}
