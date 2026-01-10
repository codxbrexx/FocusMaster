import { Activity, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminTrafficChart } from '../features/dashboard/AdminTrafficChart';

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
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">System Overview</h1>
                    <p className="text-muted-foreground text-sm mt-1">Real-time monitoring and analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        System Operational
                    </span>
                    <select className="bg-secondary/50 border border-border/50 text-sm text-foreground rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary/50">
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
                        className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-border/60 transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-muted-foreground text-xs uppercase font-semibold tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-foreground mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
                            </div>
                            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} bg-opacity-50`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span className={stat.change.startsWith('+') ? 'text-emerald-500' : 'text-destructive'}>
                                {stat.change}
                            </span>
                            <span className="text-muted-foreground">vs. previous period</span>
                        </div>
                        {/* Glow Effect */}
                        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} />
                    </motion.div>
                ))}
            </div>

            {/* Main Chart Area Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-foreground">Traffic Overview</h3>
                        <button className="text-xs text-primary hover:text-primary/80">View Detailed Report</button>
                    </div>

                    <div className="w-full h-[300px] flex items-center justify-center border border-border/20 rounded-xl bg-secondary/10 overflow-hidden">
                        <AdminTrafficChart />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        System Events
                    </span>
                </div>

                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                    <RecentActivityList />
                </div>
            </div>
        </div>
    );
};

// Sub-component for dashboard specific view
import { adminService } from '../../services/admin.service';
import { useState, useEffect } from 'react';
import { Shield, User, FileText, Zap } from 'lucide-react';

const RecentActivityList = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        adminService.getAuditLogs().then(data => {
            if (Array.isArray(data)) {
                setActivities(data.slice(0, 10)); // Show last 10
            } else {
                console.error('Audit logs data is not an array:', data);
                setActivities([]);
            }
        }).catch(err => {
            console.error('Failed to fetch audit logs:', err);
            setError(true);
        });
    }, []);

    const getIcon = (action: string) => {
        if (!action) return Shield;
        if (action.includes('USER')) return User;
        if (action.includes('FEEDBACK')) return FileText;
        if (action.includes('SYSTEM')) return Zap;
        return Shield;
    };

    if (error) return <div className="text-sm text-destructive text-center py-4">Failed to load activity</div>;
    if (!Array.isArray(activities) || activities.length === 0) return <div className="text-sm text-muted-foreground text-center py-4">No recent activity</div>;

    return (
        <div className="flex flex-col gap-3">
            {activities.map((log) => {
                const Icon = getIcon(log?.action || '');
                return (
                    <div key={log._id || Math.random()} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors border border-border/30 group">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm">
                                {log.actorName ? log.actorName.charAt(0) : '?'}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-background rounded-full flex items-center justify-center border border-border">
                                <Icon size={8} className="text-muted-foreground" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground truncate">{log.action || 'Unknown Action'}</p>
                                <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 rounded">
                                    {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate group-hover:text-primary/80 transition-colors">
                                {log.details || 'No details'}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
