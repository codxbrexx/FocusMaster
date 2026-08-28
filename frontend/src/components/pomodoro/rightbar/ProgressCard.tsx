import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Target } from 'lucide-react';

export const ProgressCard = ({ sessionCount }: { sessionCount: number }) => {
  const { sessions } = useHistoryStore();
  const { settings } = useSettingsStore();
  const goal = settings.dailyGoal || 8;

  const stats = useMemo(() => {
    const today = new Date();
    const todaySessions = sessions.filter((s) => {
      const d = new Date(s.startTime);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });
    const focusMinutes = todaySessions
      .filter((s) => s.type === 'pomodoro')
      .reduce((acc, s) => acc + s.duration, 0);
    const breakMinutes = todaySessions
      .filter((s) => s.type !== 'pomodoro')
      .reduce((acc, s) => acc + s.duration, 0);
    const longestSession = todaySessions
      .filter((s) => s.type === 'pomodoro')
      .reduce((max, s) => Math.max(max, s.duration), 0);
    const productivity = goal > 0 ? Math.min(Math.round((sessionCount / goal) * 100), 100) : 0;
    return { focusMinutes, breakMinutes, longestSession, productivity };
  }, [sessions, sessionCount, goal]);

  const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);

  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c - (sessionCount / goal) * c;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#6E36E4]" />
          Today's Goal Progress
        </h3>
        <span className="text-xs font-semibold text-slate-400">Target {goal}</span>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center py-2">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} stroke="#F1F5F9" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r={r}
              stroke="#6E36E4"
              strokeWidth="8"
              fill="none"
              strokeDasharray={c}
              strokeDashoffset={Math.max(offset, 0)}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-slate-900 leading-none">
              {sessionCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-0.5">/ {goal} goals</span>
          </div>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-semibold">
        {[
          { label: 'Focus Time', value: fmtMin(stats.focusMinutes), color: 'bg-[#6E36E4]' },
          { label: 'Break Time', value: fmtMin(stats.breakMinutes), color: 'bg-emerald-500' },
          { label: 'Longest Session', value: fmtMin(stats.longestSession), color: 'bg-amber-500' },
          { label: 'Efficiency Goal', value: `${stats.productivity}%`, color: 'bg-blue-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span>{label}</span>
            </div>
            <span className="font-mono font-bold text-slate-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
