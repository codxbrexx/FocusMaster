import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useHistoryStore } from '@/store/useHistoryStore';

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const CalendarCard = () => {
  const { sessions } = useHistoryStore();
  const [current, setCurrent] = useState(new Date());

  const today = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();

  // Mon-first offset: Sun=6, Mon=0 … Sat=5
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Count pomodoro sessions per day this month
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

  // Build cell array padded to full weeks
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = current.toLocaleString('default', { month: 'long' });

  const isThisMonth =
    today.getMonth() === month && today.getFullYear() === year;

  return (
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <p className="text-sm font-bold text-foreground leading-none">{monthName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{year}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={prev}
            id="cal-prev-month"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            id="cal-next-month"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <CardContent className="px-5 pb-5">
        {/* ── Day-of-week headers ── */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-[10px] font-bold py-1.5 tracking-wide uppercase
                ${i >= 5 ? 'text-muted-foreground/50' : 'text-muted-foreground'}
              `}
            >
              {d}
            </div>
          ))}
        </div>

        {/* ── Date grid ── */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-9" />;
            }

            const colIndex = idx % 7; // 0=Mon … 6=Sun
            const isWeekend = colIndex >= 5;
            const isToday = isThisMonth && today.getDate() === day;
            const focusCount = focusCountPerDay.get(day) ?? 0;
            const hasFocus = focusCount > 0;

            // dot intensity: 1-2 = light, 3-5 = medium, 6+ = full
            const dotOpacity =
              focusCount >= 6 ? 'opacity-100' :
              focusCount >= 3 ? 'opacity-70' :
              'opacity-40';

            return (
              <div
                key={day}
                className="flex flex-col items-center justify-center h-9"
              >
                <button
                  id={`cal-day-${day}`}
                  className={`
                    relative w-7 h-7 rounded-xl text-xs font-semibold flex items-center justify-center
                    transition-all duration-200 select-none
                    ${isToday
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 ring-2 ring-violet-600/20 scale-110'
                      : hasFocus
                        ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20'
                        : isWeekend
                          ? 'text-muted-foreground/50 hover:bg-secondary'
                          : 'text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  {day}
                  {/* Focus dot — bottom of cell when NOT today */}
                  {hasFocus && !isToday && (
                    <span
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-500 ${dotOpacity}`}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Legend ── */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shadow-sm" />
            <span className="text-[10px] text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500/10 border border-violet-500/30" />
            <span className="text-[10px] text-muted-foreground">Focus day</span>
          </div>
          <div className="ml-auto text-[10px] text-muted-foreground">
            {focusCountPerDay.size} day{focusCountPerDay.size !== 1 ? 's' : ''} this month
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
