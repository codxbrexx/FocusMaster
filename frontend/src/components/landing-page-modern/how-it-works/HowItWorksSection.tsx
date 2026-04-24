import { motion } from 'framer-motion';
import {
  LogIn,
  Settings,
  Play,
  TrendingUp,
} from 'lucide-react';

const steps = [
  {
    icon: LogIn,
    number: '01',
    title: 'Sign Up in Seconds',
    description: 'Create your account with Google or email. No credit card required to start.',
  },
  {
    icon: Settings,
    number: '02',
    title: 'Customize Your Workflow',
    description: 'Set your Pomodoro intervals, connect Spotify, and configure your preferences.',
  },
  {
    icon: Play,
    number: '03',
    title: 'Start Your Focus Session',
    description: 'Begin a timed session and watch as FocusMaster tracks your productivity.',
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Review Your Insights',
    description: 'Analyze your productivity patterns with beautiful, actionable analytics.',
  },
];

export const HowItWorksSection = () => {
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
          How It Works
        </h2>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl">
          Get started in minutes and begin your journey to peak productivity.
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative p-8 rounded-xl border border-slate-700 hover:border-indigo-500/50 bg-slate-900/20 transition-all hover:shadow-lg hover:bg-slate-900/40"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                {/* Step number badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="mb-6 mt-2">
                  <div className="w-14 h-14 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-indigo-400" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
