import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Zap,
  BarChart3,
  Music,
  Clock,
  Target,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Zap,
    title: 'Pomodoro Timer',
    description: 'Proven productivity technique with customizable intervals to maintain peak focus.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Understand your productivity patterns with beautiful, actionable insights.',
  },
  {
    icon: Music,
    title: 'Spotify Integration',
    description: 'Control your music without breaking focus. Curated playlists included.',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Automatically track billable hours and project time for accurate reporting.',
  },
  {
    icon: Target,
    title: 'Task Management',
    description: 'Organize tasks with smart prioritization and visual progress tracking.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and never shared. Full control over your information.',
  },
];

export const FeaturesSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleFeatures = showAll ? features : features.slice(0, 3);

  return (
    <section className="relative w-full bg-[#0A0A14] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
      {/* Section Header */}
      <motion.div
        className="mx-auto max-w-6xl mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          Unlock Your Potential
        </h2>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
          FocusMaster provides the tools you need to eliminate distractions and perform at your best.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              className="p-8 rounded-xl border border-slate-800 bg-slate-900/30 transition-all group relative overflow-hidden"
              whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(79, 70, 229, 0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-2 -right-2 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-300"></div>
              {/* Icon */}
              <div className="mb-6 relative z-10">
                <div className="w-14 h-14 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Icon className="w-7 h-7 text-indigo-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
