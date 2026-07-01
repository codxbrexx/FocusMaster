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
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
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
                  className="lg:w-1/2 w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md shadow-lg relative overflow-hidden`}
                  >
                    
                    <div className={`aspect-video rounded-xl flex items-center justify-center p-4`}>
                      {/* Focus Engine (Timer) */}
                      {index === 0 && (
                        <div className="flex flex-col items-center justify-center w-full">
                          <div className="relative w-36 h-36 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
                            {/* Glowing circular progress mask */}
                            <svg className="absolute -inset-1 w-[152px] h-[152px] -rotate-90">
                              <circle
                                cx="76"
                                cy="76"
                                r="70"
                                fill="transparent"
                                stroke="#4f46e5"
                                strokeWidth="4"
                                strokeDasharray="440"
                                strokeDashoffset="110"
                                className=""
                              />
                            </svg>
                            <div className="flex flex-col items-center">
                              <span className="text-4xl font-mono font-bold text-white tracking-wider">
                                25:00
                              </span>
                              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold mt-1">
                                Focus
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-6">
                            <button className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-transform hover:scale-105 shadow-md">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-transform hover:scale-105 border border-slate-700">
                              <Coffee className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Task Manager (Kanban) */}
                      {index === 1 && (
                        <div className="flex gap-4 w-full h-full text-left">
                          {/* Column 1 */}
                          <div className="flex-1 flex flex-col bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-3">To Do</span>
                            <div className="space-y-2 overflow-y-auto pr-0.5">
                              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
                                <p className="text-xs font-semibold text-white">Database Migration</p>
                                <span className="inline-block mt-2 px-1.5 py-0.5 text-[8px] bg-indigo-500/10 text-indigo-400 rounded font-bold uppercase">High</span>
                              </div>
                              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                <p className="text-xs font-semibold text-white">Update API docs</p>
                              </div>
                            </div>
                          </div>
                          {/* Column 2 */}
                          <div className="flex-1 flex flex-col bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">In Progress</span>
                              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                              <div className="bg-slate-950 p-2.5 rounded-lg border border-indigo-500/30">
                                <p className="text-xs font-semibold text-white">Design Landing Page</p>
                                <div className="mt-3 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full w-[70%]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Productivity Analytics */}
                      {index === 2 && (
                        <div className="flex flex-col w-full h-full justify-between">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly Performance</span>
                            <span className="text-[10px] px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full font-bold">Peak Focus: 4.8h</span>
                          </div>
                          <div className="flex items-end justify-between w-full px-4 h-32 gap-3 mt-4">
                            {[
                              { h: 30, day: 'Mon' },
                              { h: 60, day: 'Tue' },
                              { h: 45, day: 'Wed' },
                              { h: 90, day: 'Thu' },
                              { h: 70, day: 'Fri' }
                            ].map((item, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-900 rounded-t-lg h-24 relative overflow-hidden flex items-end">
                                  <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${item.h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-full bg-violet-600 rounded-t-lg"
                                  />
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">{item.day}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Spotify Control */}
                      {index === 3 && (
                        <div className="flex flex-col bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 w-full max-w-[340px]">
                          <div className="flex items-center gap-4">
                            {/* album cover art placeholder */}
                            <div className="w-16 h-16 rounded-lg bg-pink-600 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                              <Music2 className="w-8 h-8 text-white" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                              <h4 className="text-sm font-bold text-white truncate">Lofi Focus Beats</h4>
                              <p className="text-xs text-rose-400 truncate mt-0.5">FocusMaster Radio</p>
                              <div className="mt-3 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Connected</span>
                              </div>
                            </div>
                          </div>
                          {/* Seek bar */}
                          <div className="mt-4">
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full w-[45%]" />
                            </div>
                            <div className="flex justify-between items-center mt-1.5">
                              <span className="text-[9px] text-slate-500 font-mono">1:24</span>
                              <span className="text-[9px] text-slate-500 font-mono">3:45</span>
                            </div>
                          </div>
                          {/* Controls */}
                          <div className="flex items-center justify-center gap-6 mt-2">
                            <button className="text-slate-400 hover:text-white transition-colors">
                              <SkipBack className="w-4 h-4 fill-current" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-md">
                              <Pause className="w-3.5 h-3.5 fill-white" />
                            </button>
                            <button className="text-slate-400 hover:text-white transition-colors">
                              <SkipForward className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Time Tracking */}
                      {index === 4 && (
                        <div className="flex flex-col bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 w-full max-w-[340px] text-left">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Shift Tracker</span>
                            <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-[8px] uppercase tracking-wider text-amber-400 font-bold">Clocked In</span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Time Elapsed</span>
                            <span className="text-3xl font-mono font-bold text-white tracking-widest">04:32:18</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5">
                              <Coffee className="w-3.5 h-3.5" /> Break
                            </button>
                            <button className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5">
                              <LogOut className="w-3.5 h-3.5" /> Clock Out
                            </button>
                          </div>
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
