'use client';

import { FloatingText } from './FloatingText';
import { CTAOverlay } from './CTAOverlay';
import { InfoCardsGrid } from './InfoCardsGrid';

export const ModernHero = () => {
  return (
    <section className="relative min-h-screen w-full bg-black flex flex-col overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Placeholder for a video background. Replace with your video file. */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" // Dark placeholder
        >
          {/* <source src="/path-to-your-video.mp4" type="video/mp4" /> */}
        </video>
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      </div>

      {/* Subtle radial glow accent */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 w-full flex flex-col md:flex-row p-8 md:p-14 lg:p-20 min-h-screen items-center md:items-stretch gap-10 md:gap-0">
        {/* Left Side - Text Content */}
        <div
          className="flex-1 min-w-0 flex flex-col justify-between pb-12 md:pb-8 w-full md:w-1/2"
        >
          {/* Header Badge */}
          <div
            className="flex items-center gap-3 p-3"
          >
            <div className="relative w-2.5 h-2.5 bg-indigo-500 rounded-full" />
            <span className="font-mono text-[11px] font-bold text-slate-300 tracking-[0.2em] uppercase">
              FOCUSMASTER PRO
            </span>
          </div>

          {/* Floating Text */}
          <FloatingText />

          {/* CTA Buttons */}
          <div>
            <CTAOverlay />
          </div>
        </div>

        {/* Right Side - Info Cards */}
        <div
          className="w-full md:w-1/2 flex items-center justify-end"
        >
          <InfoCardsGrid />
        </div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiMzNzQxNTEiIG9wYWNpdHk9IjAuMyIvPjwvZz48L3N2Zz4=')] opacity-20 z-[1]" />
    </section>
  );
};
