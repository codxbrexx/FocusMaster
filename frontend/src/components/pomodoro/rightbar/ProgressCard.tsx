import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ProgressCard = ({ sessionCount }: { sessionCount: number }) => {
  const { sessions } = useHistoryStore();
  const { settings } = useSettingsStore();
  const goal = settings.dailyGoal || 8;

  const stats = useMemo(() => {
    const today = new Date();
    const todaySessions = sessions.filter((s) => {
      const d = new Date(s.startTime);
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    const focusMinutes = todaySessions.filter((s) => s.type === 'pomodoro').reduce((acc, s) => acc + s.duration, 0);
    const breakMinutes = todaySessions.filter((s) => s.type !== 'pomodoro').reduce((acc, s) => acc + s.duration, 0);
    const longestSession = todaySessions.filter((s) => s.type === 'pomodoro').reduce((max, s) => Math.max(max, s.duration), 0);
    const productivity = goal > 0 ? Math.min(Math.round((sessionCount / goal) * 100), 100) : 0;
    return { focusMinutes, breakMinutes, longestSession, productivity };
  }, [sessions, sessionCount, goal]);

  const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);

  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c - (sessionCount / goal) * c;

  return (
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 px-5 pt-5">
        <CardTitle className="text-sm font-semibold text-foreground">Today's Progress</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {/* Donut */}
        <div className="flex justify-center mb-5">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={r} stroke="currentColor" strokeWidth="10" fill="none" className="text-secondary" />
              <circle
                cx="50" cy="50" r={r}
                stroke="hsl(var(--primary))"
                strokeWidth="10"
                fill="none"
                strokeDasharray={c}
                strokeDashoffset={Math.max(offset, 0)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-foreground tabular-nums leading-none">{sessionCount}</span>
              <span className="text-[10px] text-muted-foreground">/ {goal}</span>
            </div>
          </div>
        </div>

        {/* Stats rows */}
        <div className="space-y-3">
          {[
            { label: 'Focus Time', value: fmtMin(stats.focusMinutes), dot: 'bg-primary' },
            { label: 'Break Time', value: fmtMin(stats.breakMinutes), dot: 'bg-green-500' },
            { label: 'Longest Session', value: fmtMin(stats.longestSession), dot: 'bg-yellow-500' },
            { label: 'Productivity', value: `${stats.productivity}%`, dot: 'bg-sky-500' },
          ].map(({ label, value, dot }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-muted-foreground">{label}</span>
              </div>
              <span className="font-semibold text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
