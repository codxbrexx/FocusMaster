
import { motion } from 'framer-motion';
import { Target, Clock, Flame, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatsOverviewProps {
    todayPomodoros: number;
    todayMinutes: number;
    dailyGoal: number;
    pomodoroDuration: number;
    currentStreak: number;
    completedToday: number;
    totalTasks: number;
}

export function StatsOverview({
    todayPomodoros,
    todayMinutes,
    dailyGoal,
    pomodoroDuration,
    currentStreak,
    completedToday,
    totalTasks,
}: StatsOverviewProps) {

    const progressPercentage = dailyGoal > 0 ? Math.min((todayPomodoros / dailyGoal) * 100, 100) : 0;

    const stats = [
        {
            title: "Today's Focus",
            value: todayPomodoros,
            label: 'sessions',
            sub: `Goal: ${dailyGoal}`,
            icon: Target,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            progress: progressPercentage,
        },
        {
            title: 'Time Focused',
            value: (todayMinutes / 60).toFixed(1),
            label: 'hours',
            sub: 'Total today',
            icon: Clock,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            progress: Math.min(
                (todayMinutes / (dailyGoal * pomodoroDuration)) * 100,
                100
            ),
        },
        {
            title: 'Current Streak',
            value: currentStreak,
            label: 'days',
            sub: 'Keep it up!',
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            progress: Math.min(currentStreak * 10, 100),
        },
        {
            title: 'Tasks Completed',
            value: completedToday,
            label: 'tasks',
            sub: 'Great work!',
            icon: CheckCircle2,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            progress: totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0,
        },
    ];

    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >                     
                    <Card className="backdrop-blur-xl bg-card/60 border border-white/10 transition-all duration-300 h-full overflow-hidden relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 relative z-10 px-6 pt-6">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2.5 rounded-xl ${stat.bg} shadow-inner`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 px-6 pb-6">
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">{stat.value}</span>
                                <span className="text-sm text-muted-foreground font-medium uppercase">{stat.label}</span>
                            </div>
                            <div className="space-y-2.5">
                                <Progress
                                    value={stat.progress || 0}
                                    className="h-2 bg-muted/50 rounded-full"
                                    indicatorClassName={`${stat.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
                                />
                                <p className="text-xs text-muted-foreground text-right font-medium opacity-80">{stat.sub}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
