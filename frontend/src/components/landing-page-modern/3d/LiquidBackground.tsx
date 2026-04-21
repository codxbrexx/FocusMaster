'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LiquidBackgroundMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uMouse.value.lerp(state.mouse, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.15;
            vec2 m = uMouse * 0.1;

            // Create wave patterns
            float wave1 = sin(uv.x * 8.0 + t + m.x * 12.0);
            float wave2 = sin(uv.y * 6.0 - t + m.y * 12.0);
            float combined = (wave1 + wave2) * 0.5 + 0.5;

            // Smooth step for gradient effect
            float color = smoothstep(0.0, 1.0, combined);

            // Create liquid effect with color variation
            vec3 liquidColor = mix(
              vec3(0.005, 0.005, 0.01),  // Dark blue-black
              vec3(0.05, 0.08, 0.15),    // Slightly lighter blue
              color
            );

            gl_FragColor = vec4(liquidColor, 1.0);
          }
        `}
      />
    </mesh>
  );
};

export const LiquidBackground = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 60], fov: 35 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <ambientLight intensity={0.4} />
      <spotLight position={[50, 50, 50]} intensity={3} />
      <LiquidBackgroundMesh />
    </Canvas>
  );
};
