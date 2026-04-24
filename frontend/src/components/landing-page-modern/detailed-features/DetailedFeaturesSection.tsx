import { motion } from 'framer-motion';
import { Timer, ListTodo, BarChart2, Music2, Clock } from 'lucide-react';

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

const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', badge: 'bg-indigo-500/20' },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20',
  },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', badge: 'bg-violet-500/20' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', badge: 'bg-pink-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20' },
};

export const DetailedFeaturesSection = () => {
  return (
    <section className="relative w-full bg-[#0f0f1e] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-20">
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
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {feature.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
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
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2.5 ${colors.text.replace('text-', 'bg-')}`}
                        />
                        <span className="text-slate-300 text-lg leading-relaxed">
                          {feat}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Visual Demo */}
                <motion.div
                  className="lg:w-1/2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`p-8 rounded-2xl border border-slate-700 ${colors.bg} backdrop-blur-sm`}
                  >
                    <div className={`aspect-video rounded-xl ${colors.badge} flex items-center justify-center`}>
                      {/* Different demos based on feature type */}
                      {index === 0 && (
                        <div className="text-6xl font-mono font-bold text-slate-400">
                          25:00
                        </div>
                      )}
                      {index === 1 && (
                        <div className="flex gap-3 w-full px-4">
                          <div className="flex-1 bg-slate-700 rounded-lg h-32" />
                          <div className="flex-1 bg-slate-700 rounded-lg h-32" />
                          <div className="flex-1 bg-slate-700 rounded-lg h-32" />
                        </div>
                      )}
                      {index === 2 && (
                        <div className="flex items-end justify-between w-full px-6 h-32 gap-2">
                          {[40, 70, 50, 90, 60, 80, 50].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`w-full rounded-t ${colors.bg}`}
                            />
                          ))}
                        </div>
                      )}
                      {index === 3 && (
                        <div className="w-16 h-16 rounded-full border-4 border-slate-600 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-slate-400 border-b-8 border-b-transparent ml-1" />
                        </div>
                      )}
                      {index === 4 && (
                        <div className="text-5xl font-mono font-bold text-slate-400">
                          09:41:05
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
