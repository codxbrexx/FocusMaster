
import { motion } from 'framer-motion';
import { Target, Zap, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsStatsProps {
    todayPomodoros: number;
    dailyGoal: number;
    completionRate: number;
    longestStreak: number;
    totalWorkHours: number;
}

export function AnalyticsStats({
    todayPomodoros,
    dailyGoal,
    completionRate,
    longestStreak,
    totalWorkHours,
}: AnalyticsStatsProps) {

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={item}>
                <Card className="backdrop-blur-xl bg-card/40 border-border group hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                                <Target className="w-5 h-5" />
                            </div>
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${completionRate >= 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 text-indigo-300'}`}
                            >
                                {completionRate}% Goal
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tabular-nums text-foreground">{todayPomodoros}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-between mt-1">
                                <span>Sessions Today</span>
                                <span className="text-xs opacity-70">Goal: {dailyGoal}</span>
                            </div>
                        </div>
                        <div className="mt-4 w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-1000"
                                style={{ width: `${Math.min(completionRate, 100)}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="backdrop-blur-xl bg-card/40 border-border group hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg group-hover:bg-amber-500/30 transition-colors">
                                <Zap className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tabular-nums text-foreground">{longestStreak}</div>
                            <div className="text-sm text-muted-foreground mt-1">Day Streak</div>
                        </div>
                        <div className="mt-4 w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-500 transition-all duration-1000"
                                style={{ width: '40%' }} // You might want to make this dynamic if possible
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="backdrop-blur-xl bg-card/40 border-border group hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tabular-nums text-foreground">{totalWorkHours}h</div>
                            <div className="text-sm text-muted-foreground mt-1">Total Work Hours</div>
                        </div>
                        <div className="mt-4 w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-1000"
                                style={{ width: '75%' }} // Dynamic width advised
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
