import { useAuth } from '@/context/AuthContext';
import { useHistoryStore } from '@/store/useHistoryStore';
import { motion } from 'framer-motion';
import { Mail, Calendar, Trophy, Clock, Flame, Zap, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { FocusHeatmap } from './FocusHeatmap'; // Reuse the heatmap component
import { format } from 'date-fns';

export function Profile() {
    const { user } = useAuth();
    const { sessions } = useHistoryStore();

    // Stats Calculations
    const totalSessions = sessions.filter(s => s.type === 'pomodoro').length;

    const totalMinutes = sessions
        .filter(s => s.type === 'pomodoro')
        .reduce((acc, s) => acc + s.duration, 0) / 60;

    const totalHours = (totalMinutes / 60).toFixed(1);

    const getDailyAverage = () => {
        if (sessions.length === 0) return 0;
        // Simple approximations for now
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
        // Simple streak calculation (contiguous days)
        let streak = 0;
        let currentCheck = new Date(); // start checking from today

        // Normalize time
        currentCheck.setHours(0, 0, 0, 0);

        // If last focus was yesterday, we start checking from yesterday. 
        // If last focus was today, we start from today.

        const lastFocusDate = new Date(sortedDates[0]);
        lastFocusDate.setHours(0, 0, 0, 0);

        // Reset currentCheck to the last active date to count backwards
        currentCheck = lastFocusDate;

        for (const dateStr of sortedDates) {
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);

            if (date.getTime() === currentCheck.getTime()) {
                streak++;
                currentCheck.setDate(currentCheck.getDate() - 1); // Move back one day
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
            className="max-w-6xl mx-auto space-y-8 pb-24" // Increased max-width for "professional" feel
        >
            {/* --- Professional Header --- */}
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm">
                {/* Cover Image Area */}
                <div className="h-48 bg-gradient-to-r from-violet-600/20 via-primary/10 to-indigo-600/20 backdrop-blur-2xl relative">
                    <div className="absolute inset-0 bg-[url('/grain.png')] opacity-30 mix-blend-overlay" />
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-8 border border-top backdrop-blur-lg">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl border-[6px] border-card bg-card shadow-xl overflow-hidden">
                                <img
                                    src={user?.picture || "/profilelogo.png"}
                                    alt={user?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-xl border border-border shadow-sm">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" />
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0 pb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{user?.name || 'Guest User'}</h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>{user?.email || 'No email provided'}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Joined {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${isGuest ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                    {isGuest ? 'Guest' : 'Pro Member'}
                                </div>
                            </div>
                        </div>

                        {/* Right Side Actions/Badges */}
                        <div className="flex items-center gap-3 pb-2">
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Current Rank</p>
                                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Gold Tier</p>
                            </div>
                            <div className="h-10 w-px bg-border/50 hidden md:block mx-2" />
                            <button className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Clock}
                    label="Total Focus Hours"
                    value={totalHours}
                    subvalue="hrs"
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Focus Sessions"
                    value={totalSessions}
                    subvalue="total"
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    icon={Flame}
                    label="Current Streak"
                    value={streak}
                    subvalue="days"
                    color="text-orange-500"
                    bg="bg-orange-500/10"
                />
                <StatCard
                    icon={Trophy}
                    label="Daily Average"
                    value={dailyAverage}
                    subvalue="sessions"
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Consistency Heatmap (Spans 2 columns) --- */}
                <div className="lg:col-span-2 space-y-6">
                    <FocusHeatmap />

                    {/* Recent Activity List - Moved here for better flow */}
                    <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Recent Activity
                            </h3>
                            <button className="text-xs font-medium text-primary hover:underline">View All</button>
                        </div>

                        <div className="space-y-1">
                            {sessions.slice(0, 5).map((session, i) => (
                                <div key={i} className="group flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 border border-transparent hover:border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.type === 'pomodoro' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {session.type === 'pomodoro' ? <Flame className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground capitalize">
                                                {session.type === 'pomodoro' ? 'Focus Session' : session.type.replace('-', ' ')}
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                {format(new Date(session.startTime), 'MMM d, h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border/50">
                                            {Math.floor(session.duration / 60)}m
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {sessions.length === 0 && (
                                <div className="text-center py-10 opacity-50">
                                    <Clock className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                                    <p>No recent sessions</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Sidebar Column: Achievements/Badges --- */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-card/50 to-muted/20 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 relative z-10">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Achievements
                        </h3>

                        <div className="space-y-4 relative z-10">
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

                        <button className="w-full mt-6 py-2 text-xs font-semibold text-center text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-colors">
                            View All Achievements
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- Micro-Components for cleaner code ---

function StatCard({ icon: Icon, label, value, subvalue, color, bg }: any) {
    return (
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                        <h4 className="text-2xl font-bold tracking-tight text-foreground">{value}</h4>
                        <span className="text-sm font-medium text-muted-foreground">{subvalue}</span>
                    </div>
                </div>
                <div className={`p-2.5 rounded-xl ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </div>
        </div>
    );
}

function AchievementItem({ title, desc, icon, unlocked, progress, total }: any) {
    return (
        <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${unlocked ? 'bg-card border-border/50' : 'bg-muted/30 border-transparent opacity-60 grayscale'}`}>
            <div className="text-2xl">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-semibold truncate">{title}</p>
                    {unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{desc}</p>

                {typeof progress !== 'undefined' && !unlocked && (
                    <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(progress / total) * 100}%` }} />
                    </div>
                )}
            </div>
        </div>
    );
}
