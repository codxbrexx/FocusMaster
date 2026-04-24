import { motion } from 'framer-motion';
import {
  Zap,
  BarChart3,
  Music,
  Clock,
  Target,
  Shield,
} from 'lucide-react';

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
  return (
    <section className="relative w-full bg-[#0f0f1e] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-20">
      {/* Section Header */}
      <motion.div
        className="mx-auto max-w-6xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          Powerful Features
        </h2>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl">
          Everything you need to achieve deep focus and maximize your productivity.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              className="p-8 rounded-xl border border-slate-700 hover:border-indigo-500/50 bg-slate-900/20 transition-all hover:shadow-lg hover:bg-slate-900/40"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
