import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { BarChart2 } from 'lucide-react';

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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#6E36E4]" />
          Weekly Activity
        </h3>
        <span className="text-xs font-semibold text-slate-400">Minutes / day</span>
      </div>

      <div className="flex items-end gap-1.5 h-20 pt-2">
        {weekData.map(({ day, minutes }, i) => {
          const heightPct = (minutes / maxMin) * 100;
          const isToday = i === todayIdx;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full flex items-end h-16">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isToday ? 'bg-[#6E36E4]' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                  style={{ height: `${Math.max(heightPct, 8)}%` }}
                  title={`${minutes}m`}
                />
              </div>
              <span
                className={`text-[10px] font-bold ${
                  isToday ? 'text-[#6E36E4]' : 'text-slate-400'
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
