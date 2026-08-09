import { motion } from 'framer-motion';
import {
  Timer,
  ListTodo,
  BarChart2,
  Music2,
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Coffee,
  LogOut,
  MessageSquare,
  Bot,
} from 'lucide-react';

const detailedFeatures = [
  {
    icon: Timer,
    color: 'indigo',
    title: 'Designed for deep work.',
    subtitle: 'Focus Engine',
    features: [
      'Fully customizable session lengths',
      'Auto-start cycles and smart break management',
      'Every session stored for analytics',
    ],
  },
  {
    icon: ListTodo,
    color: 'emerald',
    title: 'Your tasks, structured with clarity.',
    subtitle: 'Task Manager',
    features: [
      'Visual drag-and-drop kanban boards',
      'Custom categories and statuses',
      'Perfect for study plans and sprint planning',
    ],
  },
  {
    icon: BarChart2,
    color: 'violet',
    title: 'Understand how you work.',
    subtitle: 'Productivity Analytics',
    features: [
      'Daily and weekly performance insights',
      'Focus heatmaps and pattern analysis',
      'Session logs and breakdown reports',
    ],
  },
  {
    icon: Bot,
    color: 'cyan',
    title: 'AI that actually helps you focus.',
    subtitle: 'FocusMaster AI',
    features: [
      'Upload PDFs to chat with your study materials and generate pop quizzes',
      'Auto-adjusting Pomodoro intervals based on your historical drop-off times',
      'Generates tailored, week-by-week study schedules for upcoming exams',
      'Receive daily actionable insights derived strictly from your focus data',
    ],
  },
  {
    icon: Music2,
    color: 'pink',
    title: 'Your music, your flow.',
    subtitle: 'Spotify Control',
    features: [
      'Play, pause, skip directly from FocusMaster',
      'Manage playlists seamlessly',
      'No context switching required',
    ],
  },
  {
    icon: Clock,
    color: 'amber',
    title: 'Know exactly where your time goes.',
    subtitle: 'Time Tracking',
    features: [
      'Clock-in/clock-out functionality',
      'Automatic session logging',
      'Perfect for freelancers and remote workers',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; badge: string; dot: string }> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', badge: 'bg-indigo-500/20', dot: 'bg-indigo-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/20', dot: 'bg-emerald-400' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', badge: 'bg-violet-500/20', dot: 'bg-violet-400' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', badge: 'bg-pink-500/20', dot: 'bg-pink-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20', dot: 'bg-amber-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', badge: 'bg-cyan-500/20', dot: 'bg-cyan-400' },
};

export const DetailedFeaturesSection = () => {
  return (
    <section className="relative w-full bg-transparent py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Features List */}
        <div className="space-y-16 md:space-y-24">
          {detailedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color as keyof typeof colorMap];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-16`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Text Content */}
                <div className="lg:w-1/2 space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-100/80">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {feature.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                    {feature.title}
                  </h3>

                  {/* Features List */}
                  <ul className="space-y-4">
                    {feature.features.map((feat, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2.5 ${colors.dot}`}
                        />
                        <span className="text-slate-600 text-lg leading-relaxed">
                          {feat}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Visual Demo */}
                <motion.div
                  className="lg:w-1/2 w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-full flex justify-center items-center overflow-visible">
                    {feature.subtitle === 'Focus Engine' && (
                      <img
                        src="/deep_work_elements.png"
                        alt="Deep Work Focus Session"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    )}
                    {feature.subtitle === 'Task Manager' && (
                      <img
                        src="/plan_focus.png"
                        alt="Plan & Focus Task Manager"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    )}
                    {feature.subtitle === 'Productivity Analytics' && (
                      <img
                        src="/productivity_element.png"
                        alt="Productivity Analytics"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    )}
                    {feature.subtitle === 'FocusMaster AI' && (
                      <img
                        src="/ai_elements.png"
                        alt="FocusMaster AI"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    )}
                    {feature.subtitle === 'Spotify Control' && (
                      <img
                        src="/sportify_elements.png"
                        alt="Spotify Control"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    )}
                    {feature.subtitle === 'Time Tracking' && (
                      <img
                        src="/time_tracker_elements.png"
                        alt="Time Tracking"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements removed */}
    </section>
  );
};
