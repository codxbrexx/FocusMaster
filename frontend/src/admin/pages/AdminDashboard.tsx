import { Activity, Users, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
    { label: 'Live Users', value: '42', change: '+12%', color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: Users },
    { label: 'Total Sessions', value: '1,284', change: '+8.1%', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Activity },
    { label: 'Error Rate', value: '0.4%', change: '-2.1%', color: 'text-rose-400', bg: 'bg-rose-500/10', icon: AlertTriangle },
    { label: 'Revenue (MTD)', value: '$12.4k', change: '+14%', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: DollarSign },
];

export const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time monitoring and analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        System Operational
                    </span>
                    <select className="bg-black/20 border border-white/10 text-sm text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500/50">
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
                            </div>
                            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} bg-opacity-50`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span className={stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                                {stat.change}
                            </span>
                            <span className="text-slate-500">vs. previous period</span>
                        </div>
                        {/* Glow Effect */}
                        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} />
                    </motion.div>
                ))}
            </div>

            {/* Main Chart Area Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Traffic Overview</h3>
                        <button className="text-xs text-cyan-400 hover:text-cyan-300">View Detailed Report</button>
                    </div>

                    <div className="w-full h-[300px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/5">
                        <p className="text-slate-500 text-sm">Traffic Chart Component (Recharts) Loading...</p>
                    </div>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Live Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                                    U{i}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm text-slate-200 truncate">User started a session</p>
                                    <p className="text-xs text-slate-500 truncate">2 minutes ago • /pomodoro</p>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
