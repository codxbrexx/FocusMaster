import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Lock } from 'lucide-react';
import gsap from 'gsap';

const cards = [
  {
    icon: Zap,
    title: 'Lightning Quick',
    description: 'Sub-100ms response time for seamless interactions',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description: 'Adaptive focus suggestions based on your patterns',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data, always yours. End-to-end encrypted.',
  },
];

export const InfoCardsGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Stagger cards animation
    const cardElements = containerRef.current.querySelectorAll('.info-card');
    gsap.from(cardElements, {
      x: 60,
      opacity: 0,
      stagger: 0.1,
      duration: 1.5,
      ease: 'power4.out',
      delay: 1,
      clearProps: 'all',
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden lg:flex flex-col gap-4 w-80"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            className="info-card glass-panel p-6 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-colors"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
