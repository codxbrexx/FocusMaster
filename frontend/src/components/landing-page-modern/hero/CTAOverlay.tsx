import { motion } from 'framer-motion';
import { Zap, BarChart3, FolderKanban } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    text: 'Boost Productivity',
    description: 'Leverage proven techniques to enhance your focus and efficiency.',
  },
  {
    icon: BarChart3,
    text: 'Gain Insights',
    description: 'Understand your work patterns with powerful, visual analytics.',
  },
  {
    icon: FolderKanban,
    text: 'Stay Organized',
    description: 'Manage tasks and projects seamlessly to keep your workflow clear.',
  },
];

export const CTAOverlay = () => {
  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center p-4 rounded-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4 border border-white/10">
                <Icon className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{benefit.text}</h3>
              <p className="mt-1 text-sm text-slate-400">{benefit.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
