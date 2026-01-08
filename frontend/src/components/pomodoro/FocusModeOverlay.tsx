
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Coffee, Armchair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { TimerMode } from '@/store/useTimerStore';

interface FocusModeOverlayProps {
    mode: TimerMode;
    timeLeft: number;
    totalDuration: number;
    status: string;
    sessionCount: number;
    activeTasks: any[];
    selectedTaskId: string;
    selectedTag: string;
    setFocusMode: (val: boolean) => void;
    setMode: (mode: TimerMode) => void;
    resetTimer: () => void;
    handleStart: () => void;
    handlePause: () => void;
    setSelectedTaskId: (id: string) => void;
    setSelectedTag: (tag: string) => void;
    formatTime: (seconds: number) => string;
}

export function FocusModeOverlay({
    mode,
    timeLeft,
    totalDuration,
    status,
    sessionCount,
    activeTasks,
    selectedTaskId,
    selectedTag,
    setFocusMode,
    setMode,
    resetTimer,
    handleStart,
    handlePause,
    setSelectedTaskId,
    setSelectedTag,
    formatTime
}: FocusModeOverlayProps) {
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

    const r = 45;
    const c = 2 * Math.PI * r;
    const offset = c - (progress / 100) * c;

    return (
        <motion.div
            layoutId="focus-mode-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-matrix flex flex-col overflow-hidden"
        >
            <div className="flex flex-col items-center pt-8 px-6 relative z-10">
                <Button
                    variant="ghost"
                    className="absolute left-6 top-8 text-muted-foreground hover:text-foreground gap-2"
                    onClick={() => setFocusMode(false)}
                >
                    <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">Exit</span>
                </Button>

                <div className="flex gap-1 bg-secondary/30 p-1.5 rounded-full backdrop-blur-md border border-white/5">
                    {[
                        { id: 'pomodoro', label: 'Focus', icon: Brain },
                        { id: 'short-break', label: 'Short Break', icon: Coffee },
                        { id: 'long-break', label: 'Long Break', icon: Armchair },
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => {
                                setMode(m.id as TimerMode);
                                resetTimer();
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${mode === m.id
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <m.icon className="w-4 h-4" />
                            <span className="hidden md:inline">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative -mt-16">
                <div className="relative w-[min(85vw,65vh)] h-[min(85vw,65vh)] max-w-[800px] max-h-[800px]">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="gradient-focus" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                            <linearGradient id="gradient-short-break" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#14b8a6" />
                                <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                            <linearGradient id="gradient-long-break" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="50"
                            cy="50"
                            r={r}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                            className="text-secondary/20 inner-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r={r}
                            stroke={`url(#gradient-${mode === 'short-break' ? 'short-break' : mode === 'long-break' ? 'long-break' : 'focus'})`}
                            strokeWidth="1.5"
                            fill="none"
                            strokeDasharray={c}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[min(18vw,12vh)] font-bold tabular-nums tracking-tighter leading-none select-none text-foreground/90">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-[min(4vw,2vh)] text-muted-foreground/60 font-medium uppercase tracking-[0.2em] mt-4">
                            {status === 'paused' ? 'PAUSED' : mode === 'pomodoro' ? 'FOCUS TIME' : 'BREAK TIME'}
                        </span>

                        <motion.div
                            className="mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {status !== 'running' ? (
                                <Button
                                    onClick={handleStart}
                                    variant="outline"
                                    className="h-16 px-12 rounded-full text-xl border border-gray-500 hover:text-purple-500 transition-all backdrop-blur-sm"
                                >
                                    START
                                </Button>
                            ) : (
                                <Button
                                    onClick={handlePause}
                                    variant="outline"
                                    className="h-16 px-12 rounded-full text-xl border border-gray-500 hover:text-purple-500 transition-all backdrop-blur-sm"
                                >
                                    PAUSE
                                </Button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="w-full py-4 px-6 md:px-12"
            >
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center backdrop-blur-lg bg-background/20 border border-white/10 rounded-xl p-6">
                        <div className="space-y-2 w-full md:w-auto min-w-[300px]">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                                Working On
                            </span>
                            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                                <SelectTrigger className="h-12 bg-card border-border text-lg text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 focus:ring-ring">
                                    <SelectValue placeholder="No Task Added" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border text-popover-foreground">
                                    <SelectItem value="none" className="focus:bg-primary/10 focus:text-primary cursor-pointer">No Task Added</SelectItem>
                                    {activeTasks.map((t) => (
                                        <SelectItem key={t._id} value={t._id} className="focus:bg-primary/10 focus:border-primary hover:text-purple-500 focus:text-primary cursor-pointer font-medium">
                                            {t.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 w-full md:w-auto">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                                Session Tag
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {['Study', 'Work', 'Code', 'Write', 'Read'].map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant={selectedTag === tag ? 'default' : 'outline'}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-4 py-1.5 cursor-pointer text-sm font-normal rounded-full transition-all border duration-300 ${selectedTag === tag ? 'bg-primary text-primary-foreground border-purple-500 hover:text-purple-500' : 'border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 text-muted-foreground'}`}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 w-full md:w-[200px]">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Daily Goal
                                </span>
                                <span className="text-lg font-bold tabular-nums">{sessionCount} / 4</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                                <div
                                    className="h-full bg-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    style={{ width: `${(sessionCount / 4) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
