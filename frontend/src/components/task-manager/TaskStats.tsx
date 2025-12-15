import { Card, CardContent } from '@/components/ui/card';
import { Target, CheckCircle2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskStatsProps {
    activeCount: number;
    completedCount: number;
    progress: number;
    finishedPomodoros: number;
    totalPomodoros: number;
}

export function TaskStats({ activeCount, completedCount, progress, finishedPomodoros, totalPomodoros }: TaskStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="backdrop-blur-xl bg-card/50 shadow-sm border-2 border-l-4 border-l-purple-500">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Active
                        </p>
                        <h3 className="text-2xl font-bold">{activeCount}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Target className="w-5 h-5" />
                    </div>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-card/50 shadow-sm border-2 border-l-4 border-l-green-500">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Done
                        </p>
                        <h3 className="text-2xl font-bold">{completedCount}</h3>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-full text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-card/50 shadow-sm border-2 border-l-4 border-l-blue-500 md:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Trophy className="w-24 h-24" />
                </div>
                <CardContent className="p-4 flex flex-col justify-center h-full">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Productivity Score
                            </p>
                            <h3 className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {finishedPomodoros} / {totalPomodoros} Sessions
                        </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-blue-500 rounded-full"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
