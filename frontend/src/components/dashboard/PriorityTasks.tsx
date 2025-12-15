
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface Task {
    _id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    completedPomodoros: number;
    estimatedPomodoros: number;
    deadline?: Date | string;
}

interface PriorityTasksProps {
    tasks: Task[];
}

export function PriorityTasks({ tasks }: PriorityTasksProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
            }}
            className="lg:col-span-2 h-full"
        >
            <Card className="h-full backdrop-blur-xl bg-card/50 border-2 shadow-sm flex flex-col">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            Priority Tasks
                        </CardTitle>
                        <CardDescription>
                            You have {tasks.length} pending tasks for today
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/tasks')}
                        className="gap-1 hover:bg-primary/5 text-primary w-full sm:w-auto justify-center"
                    >
                        View All <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                    {tasks.length === 0 ? (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground bg-accent/5 rounded-2xl border-2 border-dashed border-border/60">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-lg font-semibold text-foreground">All caught up!</p>
                            <p className="text-sm max-w-[250px] mt-1">
                                No pending tasks for today. Enjoy your free time or start something new.
                            </p>
                            <Button variant="outline" onClick={() => navigate('/tasks')} className="mt-6">
                                Create New Task
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.slice(0, 4).map((task) => (
                                <div
                                    key={task._id}
                                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card hover:bg-accent/40 border border-border/40 hover:border-primary/20 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div
                                            className={`w-1.5 h-12 rounded-full flex-shrink-0 ${task.priority === 'high'
                                                ? 'bg-red-500'
                                                : task.priority === 'medium'
                                                    ? 'bg-orange-500'
                                                    : 'bg-blue-500'
                                                }`}
                                        />

                                        <div className="flex-1 sm:hidden">
                                            <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="hidden sm:flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
                                            </span>
                                        </div>
                                        <div className="flex sm:hidden items-center justify-between mb-2">
                                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Progress
                                                value={(task.completedPomodoros / task.estimatedPomodoros) * 100}
                                                className="h-1.5 flex-1 bg-muted"
                                            />
                                            {task.deadline && (
                                                <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                                                    <Calendar className="mr-1.5 h-3 w-3" />
                                                    {new Date(task.deadline).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
