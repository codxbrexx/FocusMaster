import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useHistoryStore } from '@/store/useHistoryStore';
import { motion } from 'framer-motion';
import { Mail, Calendar, Trophy, Clock, Flame, Zap, CheckCircle2, MoreHorizontal, Edit3 } from 'lucide-react';
import { FocusHeatmap } from './FocusHeatmap';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProfileSettings } from './settings/ProfileSettings';

export function Profile() {
    const { user } = useAuth();
    const { sessions } = useHistoryStore();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Stats Calculations
    const totalSessions = sessions.filter(s => s.type === 'pomodoro').length;

    const totalMinutes = sessions
        .filter(s => s.type === 'pomodoro')
        .reduce((acc, s) => acc + s.duration, 0) / 60;

    const totalHours = (totalMinutes / 60).toFixed(1);

    const getDailyAverage = () => {
        if (sessions.length === 0) return 0;
        const uniqueDays = new Set(sessions.map(s => new Date(s.startTime).toDateString())).size;
        return uniqueDays > 0 ? (totalSessions / uniqueDays).toFixed(1) : 0;
    };

    const getCurrentStreak = () => {
        if (sessions.length === 0) return 0;
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        const dates = [...new Set(sessions.map((s) => new Date(s.startTime).toDateString()))];
        const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        const lastFocus = sortedDates[0];
        if (lastFocus !== today && lastFocus !== yesterdayStr) {
            return 0;
        }

        // Simple streak calculation
        let streak = 0;
        let currentCheck = new Date();
        currentCheck.setHours(0, 0, 0, 0);

        const lastFocusDate = new Date(sortedDates[0]);
        lastFocusDate.setHours(0, 0, 0, 0);
        currentCheck = lastFocusDate;

        for (const dateStr of sortedDates) {
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);

            if (date.getTime() === currentCheck.getTime()) {
                streak++;
                currentCheck.setDate(currentCheck.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const streak = getCurrentStreak();
    const dailyAverage = getDailyAverage();
    const isGuest = user?.isGuest || localStorage.getItem('isGuest') === 'true';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8 pb-24"
        >
            {/* --- Professional Header --- */}
            <div className="relative rounded-3xl overflow-hidden bg-card/50 backdrop-blur-xl border border-border/50 shadow-sm group">
                {/* Cover Image Area */}
                <div className="h-56 bg-gradient-to-br from-indigo-600/20 via-primary/10 to-purple-900/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grain.png')] opacity-30 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -ml-10 -mb-10 mix-blend-screen" />
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 gap-6">
                        {/* Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 rounded-2xl border-[6px] border-card bg-card shadow-2xl overflow-hidden relative z-10">
                                <img
                                    src={user?.picture || "/profilelogo.png"}
                                    alt={user?.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                                />
                            </div>
                            {/* Online Indicator */}
                            <div className="absolute -bottom-1 -right-1 z-20 bg-background p-1 rounded-xl border border-border shadow-sm">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" />
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0 pb-2 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">{user?.name || 'Guest User'}</h1>
                                {user?.role === 'admin' && (
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                                        Admin
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>{user?.email || 'No email provided'}</span>
                                </div>
                                <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Joined {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
                                <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isGuest ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                    {isGuest ? 'Guest' : 'Pro Member'}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pb-2 w-full md:w-auto justify-center">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0">
                                        <Edit3 className="w-4 h-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your personal details and account settings.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="pt-4">
                                        <ProfileSettings />
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <div className="h-10 w-px bg-border/50 hidden md:block mx-1" />

                            <button className="p-2.5 rounded-xl hover:bg-muted/80 transition-colors border border-transparent hover:border-border text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Clock}
                    label="Focus Hours"
                    value={totalHours}
                    subvalue="hrs"
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                    trend="+12% vs last week"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Sessions"
                    value={totalSessions}
                    subvalue="total"
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                    trend="Top 5% of users"
                />
                <StatCard
                    icon={Flame}
                    label="Streak"
                    value={streak}
                    subvalue="days"
                    color="text-orange-500"
                    bg="bg-orange-500/10"
                    trend="Keep it up!"
                />
                <StatCard
                    icon={Trophy}
                    label="Daily Avg"
                    value={dailyAverage}
                    subvalue="sess"
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                    trend="Consistent"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Consistency Heatmap (Spans 2 columns) --- */}
                <div className="lg:col-span-2 space-y-6">
                    <FocusHeatmap />

                    {/* Recent Activity List */}
                    <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                Recent Activity
                            </h3>
                            <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View History</button>
                        </div>

                        <div className="space-y-1">
                            {sessions.slice(0, 5).map((session, i) => (
                                <div key={i} className="group flex items-center justify-between p-3.5 hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent rounded-xl transition-all duration-300 border border-transparent hover:border-border/40">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${session.type === 'pomodoro' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {session.type === 'pomodoro' ? <Flame className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground capitalize truncate">
                                                {session.type === 'pomodoro' ? 'Deep Focus Session' : session.type.replace('-', ' ')}
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                {format(new Date(session.startTime), 'MMM d, h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-1 rounded-md bg-secondary/50 text-xs font-medium text-secondary-foreground border border-border/30">
                                            {Math.floor(session.duration / 60)}m
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {sessions.length === 0 && (
                                <div className="text-center py-12 opacity-50 border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                                    <Clock className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                                    <p className="text-sm font-medium">No recent sessions found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Achievements / Rank --- */}
                <div className="space-y-6">
                    {/* Rank Card */}
                    <div className="bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-background to-background backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700" />

                        <div className="relative z-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2 block">Current Rank</span>
                            <div className="flex items-end gap-2 mb-4">
                                <h3 className="text-3xl font-bold text-foreground">Gold Tier</h3>
                                <div className="mb-1.5 text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">LVL 5</div>
                            </div>

                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[75%]" />
                            </div>
                            <p className="text-xs text-muted-foreground flex justify-between">
                                <span>3,500 XP</span>
                                <span>Next: Platinum</span>
                            </p>
                        </div>
                    </div>

                    {/* Achievements List */}
                    <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            Achievements
                        </h3>

                        <div className="space-y-3">
                            <AchievementItem
                                title="Early Bird"
                                desc="Complete a session before 8AM"
                                icon="🌅"
                                unlocked={true}
                            />
                            <AchievementItem
                                title="Focus Master"
                                desc="Reach 100 total hours"
                                icon="🧘"
                                unlocked={parseFloat(totalHours) >= 100}
                                progress={Math.min(parseFloat(totalHours), 100)}
                                total={100}
                            />
                            <AchievementItem
                                title="Streak King"
                                desc="7 day streak"
                                icon="🔥"
                                unlocked={streak >= 7}
                                progress={streak}
                                total={7}
                            />
                        </div>

                        <button className="w-full mt-6 py-2.5 text-xs font-semibold text-center text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-all duration-200">
                            View All Achievements
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- Micro-Components ---

function StatCard({ icon: Icon, label, value, subvalue, color, bg, trend }: any) {
    return (
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {trend && <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-full border border-emerald-500/10">{trend}</span>}
            </div>
            <div>
                <h4 className="text-2xl font-bold tracking-tight text-foreground">{value}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                    <span className="text-[10px] text-muted-foreground/60">• {subvalue}</span>
                </div>
            </div>
        </div>
    );
}

function AchievementItem({ title, desc, icon, unlocked, progress, total }: any) {
    return (
        <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${unlocked ? 'bg-gradient-to-br from-card to-background border-border/50 shadow-sm' : 'bg-muted/20 border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}>
            <div className="text-2xl shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-semibold truncate">{title}</p>
                    {unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{desc}</p>

                {typeof progress !== 'undefined' && !unlocked && (
                    <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(progress / total) * 100}%` }} />
                    </div>
                )}
            </div>
        </div>
    );
}
