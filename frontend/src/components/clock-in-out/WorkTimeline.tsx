import type { ClockEntry } from '@/store/useHistoryStore';

interface WorkTimelineProps {
  entries: ClockEntry[];
}

export function WorkTimeline({ entries }: WorkTimelineProps) {
  const formatArrivalTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateDuration = (start: Date, end?: Date) => {
    if (!end) return 'Active';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (entries.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900">Working Hours Timeline</h3>
      </div>

      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-600 font-mono font-medium min-w-[140px] flex items-center gap-2">
              <span>
                {formatArrivalTime(new Date(entry.clockIn))} -{' '}
                {entry.clockOut ? formatArrivalTime(new Date(entry.clockOut)) : 'Active'}
              </span>
            </div>
            {entry.clockOut && (
              <span className="text-[11px] font-bold text-[#6E36E4] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                {calculateDuration(entry.clockIn, entry.clockOut)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
