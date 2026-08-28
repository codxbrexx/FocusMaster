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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-6 font-sans text-slate-900">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Arrival Time
        </p>
        <div className="text-2xl font-bold font-mono text-emerald-600">
          {todayEntry && isToday ? formatArrivalTime(new Date(todayEntry.clockIn)) : '--:-- --'}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Departure Time</p>
        <div className="text-2xl font-bold font-mono text-slate-800">
          {todayEntry && isToday && todayEntry.clockOut
            ? formatArrivalTime(new Date(todayEntry.clockOut))
            : todayEntry && isToday
              ? 'Online Now'
              : '--:-- --'}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Productive Time
        </p>
        <div className="text-2xl font-bold font-mono text-[#6E36E4]">
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
    </div>
  );
}
