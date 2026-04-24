'use client';

import { motion } from 'framer-motion';
import { FloatingText } from './FloatingText';
import { CTAOverlay } from './CTAOverlay';
import { InfoCardsGrid } from './InfoCardsGrid';

export const ModernHero = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#0f0f1e] flex flex-col overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Professional Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] pointer-events-none" />

      {/* Subtle radial glow accent */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 w-full flex flex-col md:flex-row p-8 md:p-14 lg:p-20 min-h-screen items-center md:items-stretch gap-10 md:gap-0">
        {/* Left Side - Text Content */}
        <motion.div
          className="flex-1 min-w-0 flex flex-col justify-between pb-12 md:pb-8 w-full md:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Badge */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="relative w-2.5 h-2.5 bg-indigo-500 rounded-full" />
            <span className="font-mono text-[11px] font-bold text-slate-300 tracking-[0.2em] uppercase">
              FOCUSMASTER PRO
            </span>
          </motion.div>

          {/* Floating Text */}
          <FloatingText />

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CTAOverlay />
          </motion.div>
        </motion.div>

        {/* Right Side - Info Cards */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <InfoCardsGrid />
        </motion.div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiMzNzQxNTEiIG9wYWNpdHk9IjAuMyIvPjwvZz48L3N2Zz4=')] opacity-20 z-[1]" />
    </section>
  );
};
