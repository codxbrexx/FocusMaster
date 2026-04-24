import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

export const CTAOverlay = () => {
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!primaryBtnRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const btn = primaryBtnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(
        e.clientX - btnCenterX,
        e.clientY - btnCenterY
      );

      if (dist < 150) {
        // Magnetic effect: button follows mouse
        const offsetX = (e.clientX - btnCenterX) * 0.4;
        const offsetY = (e.clientY - btnCenterY) * 0.4;

        gsap.to(btn, {
          x: offsetX,
          y: offsetY,
          duration: 0.6,
          overwrite: 'auto',
        });
      } else {
        // Return to original position
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <motion.button
        ref={primaryBtnRef}
        onClick={() => navigate('/register')}
        className="w-fit flex items-center gap-6 group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-14 h-14 rounded-full border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-500 overflow-hidden">
          <ArrowRight className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors duration-500" />
        </div>
        <span className="font-mono text-[11px] font-bold text-white uppercase tracking-[0.2em]">
          Reclaim Your Focus
        </span>
      </motion.button>

      <motion.button
        onClick={() => window.open('https://demo.focusmaster.dev', '_blank')}
        className="w-fit flex items-center gap-4 group"
        whileHover={{ scale: 1.02 }}
      >
        <span className="font-mono text-[11px] font-bold text-slate-400 group-hover:text-slate-200 uppercase tracking-[0.2em] transition-colors">
          Watch Demo
        </span>
        <div className="w-px h-4 bg-slate-600 group-hover:bg-slate-400 transition-colors" />
      </motion.button>
    </div>
  );
};
