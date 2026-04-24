import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  Target,
  Star,
  CheckSquare,
  Flame,
} from 'lucide-react';
import { StatCard } from './StatCard';

const stats = [
  {
    icon: Clock,
    value: 0.1,
    label: 'Hours Tracked',
    suffix: '+',
  },
  {
    icon: Users,
    value: 0.1,
    label: 'Active Users',
    suffix: '+',
  },
  {
    icon: Target,
    value: 95,
    label: 'Focus Success Rate',
    suffix: '%',
  },
  {
    icon: Star,
    value: 4,
    label: 'Average Rating',
    suffix: '/5.0',
  },
  {
    icon: CheckSquare,
    value: 50000,
    label: 'Tasks Completed',
    suffix: '+',
  },
  {
    icon: Flame,
    value: 30,
    label: 'Max Streak',
    suffix: 'days',
  },
];

export const StatsSection = () => {
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
          By The Numbers
        </h2>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl">
          Join thousands of professionals who have transformed their productivity
          with FocusMaster.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
