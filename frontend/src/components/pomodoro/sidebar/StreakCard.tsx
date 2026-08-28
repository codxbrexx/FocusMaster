import { useHistoryStore } from '@/store/useHistoryStore';
import { useMemo } from 'react';
import { Flame } from 'lucide-react';

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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          Focus Streak
        </h3>
        <span className="text-xs font-semibold text-slate-400">Streak Stats</span>
      </div>

      {/* Streak count */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-500">
          <Flame className="w-6 h-6" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono text-slate-900 leading-none">
            {current}
          </span>
          <span className="text-xs font-semibold text-slate-500">days streak</span>
        </div>
      </div>

      {/* Week dots */}
      <div className="flex items-center justify-between pt-1">
        {weekDays.map((d, i) => {
          const key = d.toLocaleDateString('en-CA');
          const done = focusDays.has(key);
          const isToday = key === todayKey;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {WEEKDAYS[i].slice(0, 2)}
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? 'bg-[#6E36E4] text-white shadow-2xs'
                    : isToday
                      ? 'border-2 border-[#6E36E4] border-dashed bg-purple-50'
                      : 'bg-slate-100'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-semibold">
        <div className="flex justify-between text-slate-600">
          <span>Longest Streak</span>
          <span className="font-mono font-bold text-slate-900">{longest} days</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Today's Status</span>
          <span
            className={`font-bold ${todayDone ? 'text-emerald-600' : 'text-amber-600'}`}
          >
            {todayDone ? '✓ Session Completed' : '○ In Progress'}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Weekly Active</span>
          <span className="font-mono font-bold text-slate-900">{weeklyCount} / 7 days</span>
        </div>
      </div>
    </div>
  );
};
