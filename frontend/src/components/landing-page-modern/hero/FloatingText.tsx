import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export const FloatingText = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // GSAP animation: blur to clear + scale
    gsap.fromTo(
      textRef.current,
      { filter: 'blur(30px)', opacity: 0, scale: 1.02 },
      { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 2.2, ease: 'expo.out' }
    );

    // Continuous floating animation
    gsap.to(textRef.current, {
      y: -10,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <motion.div
      ref={textRef}
      className="max-w-4xl lg:-translate-y-8 pr-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-[clamp(3.5rem,9.5vw,11.5rem)] font-black leading-[0.87] tracking-tighter text-white uppercase">
        Transform Your <br />
        <span
          className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 bg-clip-text text-transparent"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease infinite',
          }}
        >
          PRODUCTIVITY
        </span>
      </h1>

      <p className="mt-8 font-mono text-[11px] text-white/40 uppercase tracking-[0.35em] max-w-sm leading-relaxed">
        We engineer immersive focus experiences through advanced productivity tools and spatial mastery.
      </p>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
};
