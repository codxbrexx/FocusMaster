import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHistoryStore } from '@/store/useHistoryStore';

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const CalendarCard = () => {
  const { sessions } = useHistoryStore();
  const [current, setCurrent] = useState(new Date());

  const today = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const focusCountPerDay = new Map<number, number>();
  sessions.forEach((s) => {
    if (s.type === 'pomodoro') {
      const d = new Date(s.startTime);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        focusCountPerDay.set(day, (focusCountPerDay.get(day) ?? 0) + 1);
      }
    }
  });

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = current.toLocaleString('default', { month: 'long' });
  const isThisMonth = today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none">{monthName}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">{year}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            id="cal-prev-month"
            className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200/60"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            id="cal-next-month"
            className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200/60"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 text-center border-b border-slate-100 pb-2">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="h-8" />;
          }

          const isToday = isThisMonth && today.getDate() === day;
          const focusCount = focusCountPerDay.get(day) ?? 0;
          const hasFocus = focusCount > 0;

          return (
            <div key={day} className="flex items-center justify-center h-8">
              <span
                className={`w-7 h-7 rounded-xl text-xs font-bold font-mono flex items-center justify-center transition-all ${
                  isToday
                    ? 'bg-[#6E36E4] text-white shadow-2xs'
                    : hasFocus
                      ? 'bg-purple-50 text-[#6E36E4] border border-purple-100'
                      : 'text-slate-700 hover:bg-slate-100'
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
