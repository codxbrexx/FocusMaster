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
    <section className="relative w-full bg-[#0A0A14] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-20">
      <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
      {/* Section Header */}
      <motion.div
        className="mx-auto max-w-6xl mb-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          Simple Steps to Success
        </h2>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
          A streamlined process designed for immediate impact on your productivity.
        </p>
      </motion.div>

      {/* Steps Timeline */}
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700/50 hidden md:block"></div>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isEven = index % 2 === 0;
          return (
            <div key={index} className={`relative mb-12 md:mb-20 flex justify-center items-center`}>
              <motion.div
                className={`w-full md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'} ${isEven ? 'md:text-right' : 'md:text-left'}`}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm relative group">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? '-right-4' : '-left-4'} w-8 h-8 rounded-full bg-indigo-500 border-4 border-[#0A0A14] hidden md:block`}></div>
                  <div className="mb-4">
                    <div className={`inline-flex w-12 h-12 rounded-lg bg-indigo-500/15 items-center justify-center border border-indigo-500/30`}>
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
