"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  attribute float aSize;
  attribute float aSpeed;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vAlpha = sin(uTime * aSpeed + position.x * 0.3) * 0.3 + 0.5;
    vec3 pos = position;
    pos.x += sin(uTime * 0.2 + position.z * 0.1) * 1.5;
    pos.y += cos(uTime * 0.15 + position.x * 0.1) * 1.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float strength = pow(1.0 - dist * 2.0, 2.5);
    gl_FragColor = vec4(uColor, strength * vAlpha * 0.6);
  }
`;

export default function NebulaParticles({ count = 800 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi) * 0.5;
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi) - 10;
      sizes[i] = Math.random() * 3 + 1;
      speeds[i] = Math.random() * 2 + 0.5;
    }
    return { positions, sizes, speeds };
  }, [count]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#00ff88") },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
