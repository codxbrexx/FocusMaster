import { motion } from 'framer-motion';
import {
    Timer,
    BarChart2,
    ListTodo,
    Music2,
    Clock
} from 'lucide-react';

export const DetailedFeatures = () => {
    return (
        <section className="relative z-10 container mx-auto px-6 py-20 space-y-32">
            {/* Pomodoro */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="lg:w-1/2 space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
                        <Timer className="w-4 h-4" /> Focus Engine
                    </div>
                    <h3 className="text-4xl font-heading font-bold">Designed for deep work.</h3>
                    <ul className="space-y-4 text-muted-foreground text-lg">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Fully customizable session lengths
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Auto-start cycles and smart break management
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Every session stored for analytics
                        </li>
                    </ul>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20"
                >
                    {/* Placeholder illustration for Pomodoro */}
                    <div className="aspect-video rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
                        <div className="text-6xl font-mono text-blue-400/50 font-bold">25:00</div>
                    </div>
                </motion.div>
            </div>

            {/* Kanban */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="lg:w-1/2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                        <ListTodo className="w-4 h-4" /> Task Manager
                    </div>
                    <h3 className="text-4xl font-heading font-bold">Your tasks, structured with clarity.</h3>
                    <ul className="space-y-4 text-muted-foreground text-lg">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> Visual drag-and-drop boards
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> Custom categories and statuses
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> Perfect for study plans and sprint planning
                        </li>
                    </ul>
                </div>
                <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20">
                    {/* Placeholder illustration for Kanban */}
                    <div className="aspect-video rounded-xl bg-green-500/10 flex gap-4 p-4 overflow-hidden border border-green-500/10">
                        <div className="w-1/3 bg-green-500/20 rounded-lg h-full" />
                        <div className="w-1/3 bg-green-500/20 rounded-lg h-full" />
                        <div className="w-1/3 bg-green-500/20 rounded-lg h-full" />
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium">
                        <BarChart2 className="w-4 h-4" /> Productivity Analytics
                    </div>
                    <h3 className="text-4xl font-heading font-bold">Understand how you work.</h3>
                    <ul className="space-y-4 text-muted-foreground text-lg">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500" /> Daily and weekly performance insights
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500" /> Focus heatmaps
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500" /> Session logs and breakdown reports
                        </li>
                    </ul>
                </div>
                <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
                    {/* Placeholder illustration for Analytics */}
                    <div className="aspect-video rounded-xl bg-purple-500/10 flex items-end justify-between p-6 gap-2 border border-purple-500/10">
                        {[40, 70, 50, 90, 60, 80, 50].map((h, i) => (
                            <div key={i} style={{ height: `${h}%` }} className="w-full bg-purple-500/40 rounded-t-sm" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Spotify */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="lg:w-1/2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium">
                        <Music2 className="w-4 h-4" /> Spotify Control
                    </div>
                    <h3 className="text-4xl font-heading font-bold">Your music, your flow.</h3>
                    <ul className="space-y-4 text-muted-foreground text-lg">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-pink-500" /> Play, pause, skip
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-pink-500" /> Manage playlists
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-pink-500" /> No context switching
                        </li>
                    </ul>
                </div>
                <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-pink-500/5 to-transparent border border-pink-500/20">
                    {/* Placeholder illustration for Spotify */}
                    <div className="aspect-video rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/10 gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-pink-500/50 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-pink-500 border-b-[8px] border-b-transparent ml-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Tracking */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium">
                        <Clock className="w-4 h-4" /> Time Tracking
                    </div>
                    <h3 className="text-4xl font-heading font-bold">Know exactly where your time goes.</h3>
                    <ul className="space-y-4 text-muted-foreground text-lg">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" /> Clock-in/clock-out
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" /> Automatic session logging
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" /> Perfect for freelancers and remote workers
                        </li>
                    </ul>
                </div>
                <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/20">
                    {/* Placeholder illustration for Time Tracking */}
                    <div className="aspect-video rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/10 text-yellow-500 font-mono text-4xl">
                        09:41:05
                    </div>
                </div>
            </div>
        </section>
    );
};
