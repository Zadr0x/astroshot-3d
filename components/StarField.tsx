"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StarField({ count = 8000, size = 0.12, range = 400 }: {
  count?: number; size?: number; range?: number;
}) {
  const ref = useRef<THREE.Points>(null!);
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3]     = (Math.random() - 0.5) * range;
      a[i * 3 + 1] = (Math.random() - 0.5) * range;
      a[i * 3 + 2] = (Math.random() - 0.5) * range;
    }
    return a;
  }, [count, range]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} color="#ffffff" sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}
