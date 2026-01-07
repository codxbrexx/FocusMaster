import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import type { ClockEntry } from '@/store/useHistoryStore';

interface WorkClockProps {
    todayEntry?: ClockEntry;
    isToday: boolean;
    todayTotal: { hours: number; minutes: number; seconds: number };
    onClockIn: () => void;
    onClockOut: () => void;
}

export function WorkClock({ todayEntry, isToday, todayTotal, onClockIn, onClockOut }: WorkClockProps) {
    return (
        <Card className="border-2 backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/50 to-card/80 shadow-x overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>

            <CardContent className="relative z-10 pt-8 pb-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                        <svg className="w-full h-full transform -rotate-90">
                            <defs>
                                <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#16a34a" stopOpacity="1" />
                                </linearGradient>
                            </defs>

                            {[...Array(60)].map((_, i) => {
                                const angle = (i * 6 * Math.PI) / 180;
                                const isHourMark = i % 5 === 0;
                                const outerRadius = 136;
                                const innerRadius = isHourMark ? 126 : 130;
                                const x1 = 144 + outerRadius * Math.cos(angle);
                                const y1 = 144 + outerRadius * Math.sin(angle);
                                const x2 = 144 + innerRadius * Math.cos(angle);
                                const y2 = 144 + innerRadius * Math.sin(angle);

                                return (
                                    <line
                                        key={i}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="currentColor"
                                        strokeWidth={isHourMark ? '2' : '1'}
                                        className="text-muted-foreground/30"
                                    />
                                );
                            })}

                            {/* Background circle */}
                            <circle
                                cx="144"
                                cy="144"
                                r="110"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-muted/10"
                            />

                            {/* Progress circle */}
                            {todayEntry && isToday && (
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="110"
                                    stroke="url(#clockGradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 110}`}
                                    strokeDashoffset={`${2 * Math.PI * 110 * (1 - (todayTotal.hours % 24) / 24)}`}
                                    className="transition-all duration-1000"
                                    strokeLinecap="round"
                                />
                            )}
                        </svg>

                        {/* Center content */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <div className="text-center space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    {todayEntry && isToday ? 'Time at Work' : 'Left Time'}
                                </p>
                                <div className="text-xl sm:text-2xl tabular-nums text-green-500">
                                    {todayEntry && isToday
                                        ? `${String(todayTotal.hours).padStart(2, '0')}h ${String(todayTotal.minutes).padStart(2, '0')}m ${String(todayTotal.seconds).padStart(2, '0')}s`
                                        : 'Online'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clock In/Out Buttons */}
                    {isToday && (
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                            <Button
                                size="lg"
                                onClick={onClockIn}
                                disabled={!!todayEntry}
                                className="flex-1 h-14 border-2 border-gray-500/20 text-base gap-3 shadow-green-500/15 hover:shadow-x hover:border-purple-500/20 transition-radius disabled:opacity-50"
                            >
                                <LogIn className="w-5 h-5" />
                                Clock In
                            </Button>
                            <Button
                                size="lg"
                                onClick={onClockOut}
                                disabled={!todayEntry}
                                variant="secondary"
                                className="flex-1 h-14 border-2 border-gray-500/20 text-base gap-3 shadow-red-500/15 hover:shadow-x hover:border-red-500/20 transition-radius disabled:opacity-40"
                            >
                                <LogOut className="w-5 h-5" />
                                Clock Out
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
