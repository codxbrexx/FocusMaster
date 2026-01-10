import { Card, CardContent } from '@/components/ui/card';
import type { ClockEntry } from '@/store/useHistoryStore';

interface InfoPanelProps {
  todayEntry?: ClockEntry;
  isToday: boolean;
  todayTotal: { hours: number; minutes: number; seconds: number };
  selectedDayEntries: ClockEntry[];
}

export function InfoPanel({ todayEntry, isToday, todayTotal, selectedDayEntries }: InfoPanelProps) {
  const formatArrivalTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className="border-2 backdrop-blur-xl bg-card/50">
      <CardContent className="pt-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Arrival Time
          </p>
          <div className="text-4xl text-green-500 tabular-nums">
            {todayEntry && isToday ? formatArrivalTime(new Date(todayEntry.clockIn)) : '--:-- --'}
          </div>
        </div>

        <div className="border-t border-border/50 pt-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Left Time</p>
          <div className="text-4xl tabular-nums">
            {todayEntry && isToday && todayEntry.clockOut
              ? formatArrivalTime(new Date(todayEntry.clockOut))
              : todayEntry && isToday
                ? 'Online'
                : '--:-- --'}
          </div>
        </div>

        <div className="border-t border-border/50 pt-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Productive Time
          </p>
          <div className="text-4xl text-blue-500 tabular-nums">
            {isToday
              ? `${String(todayTotal.hours).padStart(2, '0')}h ${String(todayTotal.minutes).padStart(2, '0')}m ${String(todayTotal.seconds).padStart(2, '0')}s`
              : `${
                  selectedDayEntries.reduce((acc, e) => {
                    if (e.clockOut) {
                      const diff = new Date(e.clockOut).getTime() - new Date(e.clockIn).getTime();
                      return acc + diff;
                    }
                    return acc;
                  }, 0) /
                  (1000 * 60 * 60)
                }h`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
