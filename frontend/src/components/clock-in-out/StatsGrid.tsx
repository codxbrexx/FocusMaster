import { Timer, Calendar, Clock } from 'lucide-react';

interface StatsGridProps {
  isToday: boolean;
  todayTotal: { hours: number; minutes: number };
  weeklyHours: string;
  totalEntries: number;
}

export function StatsGrid({ isToday, todayTotal, weeklyHours, totalEntries }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Hours</span>
          <div className="p-2.5 rounded-xl bg-purple-50 text-[#6E36E4]">
            <Timer className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-slate-900">
            {isToday ? `${todayTotal.hours}h ${todayTotal.minutes}m` : '0h 0m'}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Total work time recorded</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Hours</span>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-slate-900">
            {weeklyHours}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Last 7 rolling days</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sessions</span>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-slate-900">
            {totalEntries}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">All time entries logged</p>
        </div>
      </div>
    </div>
  );
}
