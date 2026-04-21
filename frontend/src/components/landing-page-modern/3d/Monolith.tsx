'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const MonolithMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;

      // Mouse tracking influence
      meshRef.current.rotation.x = state.mouse.y * 0.2;
      meshRef.current.rotation.z = state.mouse.x * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[13, 1]} />
        <MeshDistortMaterial
          color="#0a0a0a"
          speed={4}
          distort={0.4}
          roughness={0.05}
          metalness={1.0}
          emissive="#7c3aed"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
};

export const Monolith = () => {
  return <MonolithMesh />;
};
