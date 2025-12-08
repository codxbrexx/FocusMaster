
import { motion } from 'framer-motion';
import { Target, Zap, Activity } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

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
                <Card className="backdrop-blur-xl bg-card/50 border-2 group hover:shadow-lg transition-all border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                <Target className="w-5 h-5" />
                            </div>
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${completionRate >= 100 ? 'bg-chart-2/20 text-chart-2' : 'bg-primary/20 text-primary'}`}
                            >
                                {completionRate}% Goal
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tabular-nums">{todayPomodoros}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-between mt-1">
                                <span>Sessions Today</span>
                                <span className="text-xs">Goal: {dailyGoal}</span>
                            </div>
                        </div>
                        <div className="mt-4 w-full h-1 bg-primary/20 rounded-full overflow-hidden">
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="backdrop-blur-xl bg-card/50 border-2 group hover:shadow-lg transition-all border-chart-3/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-chart-3/20 text-chart-3 rounded-lg">
                                <Zap className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tabular-nums">{longestStreak}</div>
                            <div className="text-sm text-muted-foreground mt-1">Day Streak</div>
                        </div>
                        <div className="mt-4 w-full h-1 bg-chart-3/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-chart-3 transition-all duration-1000"
                                style={{ width: '40%' }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="backdrop-blur-xl bg-card/50 border-2 group hover:shadow-lg transition-all border-chart-2/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-chart-2/20 text-chart-2 rounded-lg">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tabular-nums">{totalWorkHours}h</div>
                            <div className="text-sm text-muted-foreground mt-1">Total Work Hours</div>
                        </div>
                        <div className="mt-4 w-full h-1 bg-chart-2/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-chart-2 transition-all duration-1000"
                                style={{ width: '75%' }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
