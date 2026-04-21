'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { LiquidBackground } from '../3d/LiquidBackground';
import { Monolith } from '../3d/Monolith';
import { FloatingText } from './FloatingText';
import { CTAOverlay } from './CTAOverlay';
import { InfoCardsGrid } from './InfoCardsGrid';
import { Loader } from '../../ui/Loader';

const LoadingFallback = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
    <Loader message="Loading 3D scene..." size={50} />
  </div>
);

export const ModernHero = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#020202] flex flex-col overflow-hidden selection:bg-white selection:text-black">
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas camera={{ position: [0, 0, 60], fov: 35 }}>
            <ambientLight intensity={0.4} />
            <spotLight position={[50, 50, 50]} intensity={3} />
            <LiquidBackground />
            <Monolith />
          </Canvas>
        </Suspense>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full flex flex-col md:flex-row p-8 md:p-14 lg:p-20 min-h-screen items-center md:items-stretch gap-10 md:gap-0">
        {/* Left Side - Text Content */}
        <motion.div
          className="flex-1 min-w-0 flex flex-col justify-between pb-12 md:pb-8 w-full md:w-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Badge */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="relative w-2.5 h-2.5 bg-white rounded-full">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
            </div>
            <span className="font-mono text-[11px] font-bold text-white tracking-[0.2em] uppercase">
              FOCUSMASTER
            </span>
          </motion.div>

          {/* Floating Text */}
          <FloatingText />

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <CTAOverlay />
          </motion.div>
        </motion.div>

        {/* Right Side - Info Cards */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <InfoCardsGrid />
        </motion.div>
      </div>

      {/* Decorative background mesh pattern */}
      <div className="fixed inset-0 pointer-events-none bento-mask opacity-5 z-[100]" />
    </section>
  );
};
