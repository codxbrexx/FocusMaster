
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
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <Card className="backdrop-blur-xl bg-card/50 border-2 shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden relative">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <Progress
                                    value={stat.progress || 0}
                                    className="h-1.5 bg-muted"
                                    indicatorClassName={stat.color.replace('text-', 'bg-')}
                                />
                                <p className="text-xs text-muted-foreground text-right">{stat.sub}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
