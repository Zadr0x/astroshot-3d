"use client";
import { useRef, Suspense, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, ScrollControls, useTexture, Stars, Float, Html } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import StarField from "./StarField";
import Astronaut from "./Astronaut";
import Planet from "./Planet";
import FloatingObjects from "./FloatingObjects";
import VideoCards from "./VideoCards";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function remap(v: number, a: number, b: number, c: number, d: number) {
  return c + Math.max(0, Math.min(1, (v - a) / (b - a))) * (d - c);
}

// ── Milky Way sphere backdrop ──────────────────────────────────────────────
function SpaceBackground() {
  const texture = useTexture("/textures/milkyway.jpg");
  return (
    <mesh>
      <sphereGeometry args={[600, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// ── Nebula green particle cloud ────────────────────────────────────────────
function NebulaCloud({ position = [0,0,0] as [number,number,number], count = 600, color = "#00ff88" }) {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { pos, sz, sp } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    const sp  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pos[i*3]   = r * Math.cos(theta) * Math.cos(phi);
      pos[i*3+1] = r * Math.sin(phi) * 0.6;
      pos[i*3+2] = r * Math.sin(theta) * Math.cos(phi);
      sz[i] = Math.random() * 3 + 0.8;
      sp[i] = Math.random() * 1.5 + 0.4;
    }
    return { pos, sz, sp };
  }, [count]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sz,  1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[sp,  1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }}
        vertexShader={`
          attribute float aSize;
          attribute float aSpeed;
          uniform float uTime;
          varying float vAlpha;
          void main() {
            vAlpha = sin(uTime * aSpeed + position.x * 0.4) * 0.3 + 0.65;
            vec3 p = position;
            p.x += sin(uTime * 0.18 + position.z * 0.08) * 1.2;
            p.y += cos(uTime * 0.14 + position.x * 0.1)  * 0.9;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = aSize * (180.0 / -mv.z);
            gl_Position  = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float s = pow(1.0 - d * 2.0, 2.5);
            gl_FragColor = vec4(uColor, s * vAlpha * 0.55);
          }
        `}
        transparent depthWrite={false} blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Floating 3D geometric objects ──────────────────────────────────────────
function GeoPrimitive({ shape, pos, color, rx, ry }: {
  shape: "box"|"torus"|"oct"|"ico"|"cone";
  pos: [number,number,number];
  color: string; rx: number; ry: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (ref.current) { ref.current.rotation.x += rx; ref.current.rotation.y += ry; }
  });
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 0.18,
    roughness: 0.15, metalness: 0.85,
  }), [color]);
  return (
    <Float speed={0.9} rotationIntensity={0.25} floatIntensity={0.55}>
      <mesh ref={ref} position={pos} material={mat}>
        {shape === "box"   && <boxGeometry args={[0.8, 0.8, 0.8]} />}
        {shape === "torus" && <torusGeometry args={[0.55, 0.16, 16, 60]} />}
        {shape === "oct"   && <octahedronGeometry args={[0.7]} />}
        {shape === "ico"   && <icosahedronGeometry args={[0.65, 0]} />}
        {shape === "cone"  && <coneGeometry args={[0.45, 1.0, 6]} />}
      </mesh>
    </Float>
  );
}

const GEO_ITEMS = [
  { shape:"box"   as const, pos:[-5.5, 1.5,-6]  as [number,number,number], color:"#00ff88", rx:0.012, ry:0.008 },
  { shape:"torus" as const, pos:[ 5.0,-1.2,-7]  as [number,number,number], color:"#ffffff", rx:0.006, ry:0.014 },
  { shape:"oct"   as const, pos:[-4.0,-2.2,-5]  as [number,number,number], color:"#00ff88", rx:0.014, ry:0.010 },
  { shape:"ico"   as const, pos:[ 6.5, 2.0,-8]  as [number,number,number], color:"#aaaaff", rx:0.010, ry:0.012 },
  { shape:"cone"  as const, pos:[-7.0, 0.5,-6]  as [number,number,number], color:"#ffffff", rx:0.008, ry:0.016 },
  { shape:"box"   as const, pos:[ 2.5, 3.5,-9]  as [number,number,number], color:"#00ff88", rx:0.016, ry:0.008 },
  { shape:"torus" as const, pos:[-1.5,-3.2,-7]  as [number,number,number], color:"#ffaa44", rx:0.010, ry:0.010 },
  { shape:"ico"   as const, pos:[ 7.5,-2.5,-6]  as [number,number,number], color:"#00ff88", rx:0.012, ry:0.014 },
  { shape:"cone"  as const, pos:[-7.5,-1.5,-8]  as [number,number,number], color:"#ffffff", rx:0.006, ry:0.010 },
  { shape:"oct"   as const, pos:[ 3.5,-4.0,-5]  as [number,number,number], color:"#aaaaff", rx:0.014, ry:0.008 },
  { shape:"box"   as const, pos:[-3.0, 4.0,-7]  as [number,number,number], color:"#00ff88", rx:0.008, ry:0.018 },
  { shape:"torus" as const, pos:[ 0.5,-5.0,-6]  as [number,number,number], color:"#ffffff", rx:0.010, ry:0.012 },
];

function GeoScene() {
  return <>{GEO_ITEMS.map((g, i) => <GeoPrimitive key={i} {...g} />)}</>;
}

// ── Oscillating work cards ─────────────────────────────────────────────────
const PROJECTS = [
  { title:"Mercedes-Benz CLA",   tags:"VFX · 3D · Campaign"    },
  { title:"Gulf Bank",           tags:"Social · Content"        },
  { title:"BYD Launch",          tags:"VFX · Motion"            },
  { title:"Honda Alghanim",      tags:"TikTok · Reels"          },
  { title:"IKEA Kuwait",         tags:"Content · Strategy"      },
  { title:"Hongqi × Astroshot",  tags:"VFX · Premium"           },
];

function OscCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<THREE.Group>(null!);
  const phase = (index / PROJECTS.length) * Math.PI * 2;
  const col = index % 3; const row = Math.floor(index / 3);
  const bx = (col - 1) * 4.4; const by = (row - 0.5) * -3.2;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = by + Math.sin(t * 0.55 + phase) * 0.22;
    ref.current.rotation.z = Math.sin(t * 0.38 + phase + 1) * 0.045;
    ref.current.rotation.x = Math.sin(t * 0.32 + phase + 2) * 0.028;
  });

  return (
    <group ref={ref} position={[bx, by, 0]}>
      <Html transform occlude={false} style={{ width:"310px", pointerEvents:"none" }}>
        <div style={{
          width:"310px", height:"200px",
          background: index % 2 === 0 ? "#0a0a0a" : "#060d18",
          border:"1px solid rgba(0,255,136,0.2)",
          display:"flex", flexDirection:"column", justifyContent:"flex-end",
          padding:"1.3rem", position:"relative", overflow:"hidden",
          boxShadow:"0 0 50px rgba(0,255,136,0.06)",
        }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(0,255,136,0.05)0%,transparent 55%)" }} />
          <div style={{ position:"absolute", top:"1rem", right:"1rem", width:"6px", height:"6px", borderRadius:"50%", background:"#00ff88", boxShadow:"0 0 10px #00ff88" }} />
          <p style={{ position:"absolute", top:"1rem", left:"1.3rem", fontSize:"0.58rem", letterSpacing:"0.16em", color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>
            {String(index+1).padStart(2,"0")}
          </p>
          <p style={{ fontSize:"1.05rem", fontWeight:700, color:"#f0f0f0", lineHeight:1.2, marginBottom:"0.45rem", fontFamily:"var(--font-space,sans-serif)" }}>
            {project.title}
          </p>
          <p style={{ fontSize:"0.62rem", letterSpacing:"0.16em", color:"#00ff88", textTransform:"uppercase" }}>
            {project.tags}
          </p>
        </div>
      </Html>
    </group>
  );
}

function WorkCards() {
  return (
    <group position={[0, 0, 0]}>
      {PROJECTS.map((p,i) => <OscCard key={i} project={p} index={i} />)}
    </group>
  );
}

// ── Mouse parallax ─────────────────────────────────────────────────────────
function MouseParallax() {
  const { camera } = useThree();
  const mouse  = useRef({ x:0, y:0 });
  const target = useRef({ x:0, y:0 });

  if (typeof window !== "undefined") {
    window.onmousemove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  useFrame(() => {
    target.current.x = lerp(target.current.x, mouse.current.x, 0.035);
    target.current.y = lerp(target.current.y, mouse.current.y, 0.035);
    camera.rotation.y = lerp(camera.rotation.y, -target.current.x * 0.07, 0.05);
    camera.rotation.x = lerp(camera.rotation.x,  target.current.y * 0.04, 0.05);
  });
  return null;
}

// ── Main scroll-driven scene orchestrator ──────────────────────────────────
function Scenes() {
  const scroll = useScroll();
  const { camera } = useThree();
  const camZ  = useRef(5);
  const camY  = useRef(0);
  const camX  = useRef(0);

  // Group refs for show/hide
  const astronautGrp  = useRef<THREE.Group>(null!);
  const planet1Grp    = useRef<THREE.Group>(null!);
  const planet2Grp    = useRef<THREE.Group>(null!);
  const geoGrp        = useRef<THREE.Group>(null!);
  const cardsGrp      = useRef<THREE.Group>(null!);
  const nebula1Grp    = useRef<THREE.Group>(null!);
  const nebula2Grp    = useRef<THREE.Group>(null!);

  useFrame(() => {
    const t = scroll.offset;

    // ── Camera Z (zoom-out journey) ──
    // pages=14  →  t=1 = 14 viewport heights of scroll
    // S0  Hero          0.00→0.07
    // S1  Manifesto     0.07→0.16
    // S2  Astronaut     0.16→0.26
    // S3  Planet Earth  0.26→0.38
    // S4  Universe/stat 0.38→0.48
    // S5  Geo objects   0.48→0.58
    // S6  Services      0.58→0.70
    // S7  Clients       0.70→0.80
    // S8  Work cards    0.80→0.92
    // S9  CTA           0.92→1.00
    const tz =
      t < 0.07 ? remap(t,0.00,0.07, 5,  5)  :
      t < 0.16 ? remap(t,0.07,0.16, 5, 10)  :
      t < 0.26 ? remap(t,0.16,0.26,10, 17)  :
      t < 0.38 ? remap(t,0.26,0.38,17, 24)  :
      t < 0.48 ? remap(t,0.38,0.48,24, 30)  :
      t < 0.58 ? remap(t,0.48,0.58,30, 35)  :
      t < 0.70 ? remap(t,0.58,0.70,35, 40)  :
      t < 0.80 ? remap(t,0.70,0.80,40, 45)  :
      t < 0.92 ? remap(t,0.80,0.92,45, 50)  :
                 remap(t,0.92,1.00,50, 54);

    camZ.current = lerp(camZ.current, tz, 0.055);
    camera.position.z = camZ.current;

    // Gentle Y & X sway
    const ty = Math.sin(t * Math.PI * 4) * 0.6;
    const tx = Math.sin(t * Math.PI * 2.5) * 0.5;
    camY.current = lerp(camY.current, ty, 0.025);
    camX.current = lerp(camX.current, tx, 0.025);
    camera.position.y = camY.current;
    camera.position.x = camX.current;

    // ── Show/hide sections ──
    const vis = (fadeIn: [number,number], fadeOut: [number,number]) => {
      const a = remap(t,fadeIn[0],fadeIn[1],0,1);
      const b = 1 - remap(t,fadeOut[0],fadeOut[1],0,1);
      return Math.min(a,b);
    };

    const setVis = (grp: THREE.Group | null, v: number) => {
      if (!grp) return;
      grp.visible = v > 0.01;
      grp.traverse(o => { if ((o as any).material) (o as any).material.opacity = v; });
    };

    if (astronautGrp.current)  { const v = vis([0.16,0.21],[0.33,0.38]); astronautGrp.current.visible  = v > 0.01; }
    if (planet1Grp.current)    { const v = vis([0.26,0.31],[0.44,0.48]); planet1Grp.current.visible    = v > 0.01; }
    if (planet2Grp.current)    { const v = vis([0.30,0.34],[0.44,0.48]); planet2Grp.current.visible    = v > 0.01; }
    if (nebula1Grp.current)    { const v = vis([0.00,0.06],[0.20,0.26]); nebula1Grp.current.visible    = v > 0.01; }
    if (nebula2Grp.current)    { const v = vis([0.26,0.32],[0.46,0.50]); nebula2Grp.current.visible    = v > 0.01; }
    if (geoGrp.current)        { const v = vis([0.48,0.54],[0.66,0.70]); geoGrp.current.visible        = v > 0.01; }
    if (cardsGrp.current)      { const v = vis([0.80,0.86],[0.94,0.98]); cardsGrp.current.visible      = v > 0.01; }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[12, 8, 10]}  intensity={1.5} color="#ffffff" />
      <pointLight position={[-8,-5, -5]}  intensity={0.7} color="#00ff88" />
      <pointLight position={[0,  0,-30]}  intensity={1.0} color="#2244ff" />
      <pointLight position={[6,  6,-50]}  intensity={0.5} color="#00ff88" />

      <MouseParallax />

      {/* Milky Way background sphere */}
      <SpaceBackground />

      {/* Dense star field on top */}
      <StarField count={6000} size={0.1} range={300} />

      {/* S0/S1: Hero nebula cloud (green) */}
      <group ref={nebula1Grp} position={[0, 0, -8]}>
        <NebulaCloud count={500} color="#00ff88" />
      </group>

      {/* S2: Astronaut */}
      <group ref={astronautGrp}>
        <Astronaut position={[2.0, 0, -14]} scale={2.0} />
        {/* Second astronaut far back */}
        <Astronaut position={[-3.5, 1.5, -18]} scale={1.2} />
      </group>

      {/* S3: Planets */}
      <group ref={planet1Grp}>
        {/* Earth */}
        <Planet
          position={[-1.5, 0.5, -21]}
          radius={2.4}
          texturePath="/textures/earth.jpg"
          atmosphereColor="#3388ff"
          hasRings={false}
          rotSpeed={0.05}
          floatSpeed={0.4}
          tilt={0.4}
        />
      </group>
      <group ref={planet2Grp}>
        {/* Jupiter (smaller, offset) */}
        <Planet
          position={[5.5, -1.5, -25]}
          radius={1.4}
          texturePath="/textures/jupiter.jpg"
          atmosphereColor="#cc8833"
          hasRings={true}
          ringColor="#ccaa66"
          rotSpeed={0.12}
          floatSpeed={0.7}
          tilt={0.15}
        />
        {/* Moon */}
        <Planet
          position={[1.2, -3.5, -19]}
          radius={0.55}
          texturePath="/textures/moon.jpg"
          atmosphereColor="#888888"
          rotSpeed={0.08}
          floatSpeed={1.1}
        />
        {/* Planet nebula */}
        <NebulaCloud position={[-2,1,-24]} count={300} color="#3366ff" />
      </group>
      <group ref={nebula2Grp} position={[0, 0, -22]}>
        <NebulaCloud count={400} color="#00ff88" />
      </group>

      {/* S5: Geometric 3D objects */}
      <group ref={geoGrp} position={[0, 0, -32]}>
        <GeoScene />
        <NebulaCloud position={[0,0,0]} count={200} color="#00ff88" />
      </group>

      {/* S8: Oscillating work cards */}
      <group ref={cardsGrp} position={[0, 0, -47]}>
        <WorkCards />
      </group>
    </>
  );
}

export default function Experience() {
  return (
    <ScrollControls pages={14} damping={0.1} distance={1}>
      <Scenes />
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0008, 0.0008] as any}
        />
      </EffectComposer>
    </ScrollControls>
  );
}
