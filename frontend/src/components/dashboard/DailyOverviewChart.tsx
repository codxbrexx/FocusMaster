
import { motion } from 'framer-motion';
import { Activity, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyOverviewChartProps {
    progressPercentage: number;
    todayPomodoros: number;
    dailyGoal: number;
    todayMinutes: number;
    sessionCount: number; 
    averageFocusDuration: number;
}

export function DailyOverviewChart({
    progressPercentage,
    todayPomodoros,
    dailyGoal,
    averageFocusDuration,
}: DailyOverviewChartProps) {
    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
            }}
            className="space-y-6"
        >
            <Card className="backdrop-blur-xl bg-card/50 border-2 shadow-sm h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-primary" />
                        Daily Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-muted/20"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={351}
                                    strokeDashoffset={351 - (351 * progressPercentage) / 100}
                                    className="text-purple-500 transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
                                <span className="text-xs text-muted-foreground">Goal</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-md text-blue-500">
                                    <Target className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase">
                                        Sessions
                                    </p>
                                    <p className="font-bold">
                                        {todayPomodoros} / {dailyGoal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-md text-purple-500">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase">
                                        Avg Focus
                                    </p>
                                    <p className="font-bold">
                                        {averageFocusDuration} min
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
