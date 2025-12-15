import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ClockEntry } from '@/store/useHistoryStore';

interface WorkTimelineProps {
    entries: ClockEntry[];
}

export function WorkTimeline({ entries }: WorkTimelineProps) {

    const formatArrivalTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const calculateDuration = (start: Date, end?: Date) => {
        if (!end) return 'Active';
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    if (entries.length === 0) return null;

    return (
        <Card className="border-2 backdrop-blur-xl bg-card/50">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-base">Working Hours</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <div key={entry.id} className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground min-w-[140px] flex items-center gap-2">
                                <span>
                                    {formatArrivalTime(new Date(entry.clockIn))} -{' '}
                                    {entry.clockOut ? formatArrivalTime(new Date(entry.clockOut)) : 'Active'}
                                </span>
                                {entry.clockOut && (
                                    <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                        {calculateDuration(entry.clockIn, entry.clockOut)}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">Work Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Private Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-muted-foreground">Idle Time</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
