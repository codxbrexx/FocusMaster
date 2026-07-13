import { useHistoryStore } from '@/store/useHistoryStore';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function computeStreak(sessions: { type: string; startTime: Date }[]) {
  const focusDays = new Set<string>();
  sessions.forEach((s) => {
    if (s.type === 'pomodoro') {
      focusDays.add(new Date(s.startTime).toLocaleDateString('en-CA'));
    }
  });

  let current = 0;
  const today = new Date();
  const cursor = new Date(today);
  while (true) {
    const key = cursor.toLocaleDateString('en-CA');
    if (focusDays.has(key)) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }

  const allDays = Array.from(focusDays)
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let streak = allDays.length > 0 ? 1 : 0;
  let longest = streak;
  for (let i = 1; i < allDays.length; i++) {
    const diff = (allDays[i].getTime() - allDays[i - 1].getTime()) / 86400000;
    if (diff === 1) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 1;
    }
  }

  return { current, longest };
}

export const StreakCard = () => {
  const { sessions } = useHistoryStore();
  const { current, longest } = useMemo(() => computeStreak(sessions), [sessions]);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const focusDays = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      if (s.type === 'pomodoro') set.add(new Date(s.startTime).toLocaleDateString('en-CA'));
    });
    return set;
  }, [sessions]);

  const todayKey = today.toLocaleDateString('en-CA');
  const todayDone = focusDays.has(todayKey);
  const weeklyCount = weekDays.filter((d) => focusDays.has(d.toLocaleDateString('en-CA'))).length;

  return (
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-sm font-semibold text-foreground">Current Streak</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {/* Streak count */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">🔥</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-foreground tabular-nums leading-none">{current}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </div>

        {/* Week dots */}
        <div className="flex items-center justify-between mb-5">
          {weekDays.map((d, i) => {
            const key = d.toLocaleDateString('en-CA');
            const done = focusDays.has(key);
            const isToday = key === todayKey;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-muted-foreground">{WEEKDAYS[i].slice(0, 2)}</span>
                <div
                  className={`w-6 h-6 rounded-full transition-all duration-300 ${
                    done
                      ? 'bg-primary shadow-sm'
                      : isToday
                      ? 'border-2 border-primary border-dashed'
                      : 'bg-secondary'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="space-y-2.5 border-t border-border/40 pt-4">
          {[
            { label: 'Longest Streak', value: `${longest} days` },
            { label: "Today's Status", value: todayDone ? '✓ Completed' : '○ Pending', accent: true, done: todayDone },
            { label: 'Weekly Average', value: `${weeklyCount} / 7 days` },
          ].map(({ label, value, accent, done }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className={`font-semibold ${accent ? (done ? 'text-green-500' : 'text-yellow-500') : 'text-foreground'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
