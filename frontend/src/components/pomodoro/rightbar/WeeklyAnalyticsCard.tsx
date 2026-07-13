import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyAnalyticsCard = () => {
  const { sessions } = useHistoryStore();

  const weekData = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const minutes = sessions
        .filter((s) => s.type === 'pomodoro')
        .filter((s) => {
          const t = new Date(s.startTime).getTime();
          return t >= day.getTime() && t < nextDay.getTime();
        })
        .reduce((acc, s) => acc + s.duration, 0);

      return { day: DAYS[i], minutes };
    });
  }, [sessions]);

  const maxMin = Math.max(...weekData.map((d) => d.minutes), 1);
  const todayIdx = (new Date().getDay() + 6) % 7;

  return (
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Weekly Analytics</CardTitle>
          <span className="text-xs text-muted-foreground">min / day</span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex items-end gap-1.5 h-20">
          {weekData.map(({ day, minutes }, i) => {
            const heightPct = (minutes / maxMin) * 100;
            const isToday = i === todayIdx;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end" style={{ height: '68px' }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                      isToday ? 'bg-primary' : 'bg-secondary'
                    }`}
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                    title={`${minutes}m`}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
