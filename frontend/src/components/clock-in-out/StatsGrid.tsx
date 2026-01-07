import { Card, CardContent } from '@/components/ui/card';
import { Timer, Calendar, Clock } from 'lucide-react';

interface StatsGridProps {
    isToday: boolean;
    todayTotal: { hours: number; minutes: number };
    weeklyHours: string;
    totalEntries: number;
}

export function StatsGrid({ isToday, todayTotal, weeklyHours, totalEntries }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="backdrop-blur-xl bg-card/50 border-2 hover:shadow-md transition-all group">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                            <Timer className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Today's Hours</p>
                        <div className="text-4xl bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent tabular-nums">
                            {isToday ? `${todayTotal.hours}h ${todayTotal.minutes}m` : '0h 0m'}
                        </div>
                        <p className="text-xs text-muted-foreground">Total work time</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-card/50 border-2 hover:shadow-md  transition-all group">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                            <Calendar className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Weekly Hours</p>
                        <div className="text-4xl bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent tabular-nums">
                            {weeklyHours}
                        </div>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-card/50 border-2 hover:shadow-md  transition-all group">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10">
                            <Clock className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Entries</p>
                        <div className="text-4xl bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent tabular-nums">
                            {totalEntries}
                        </div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
