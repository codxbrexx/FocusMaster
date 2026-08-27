import { LogIn, LogOut, Pause, Clock } from 'lucide-react';
import type { ClockEntry } from '@/store/useHistoryStore';

interface WorkClockProps {
  todayEntry?: ClockEntry;
  isToday: boolean;
  todayTotal: { hours: number; minutes: number; seconds: number };
  onClockIn: () => void;
  onClockOut: () => void;
  onBreak?: () => void;
}

export function WorkClock({
  todayEntry,
  isToday,
  todayTotal,
  onClockIn,
  onClockOut,
  onBreak,
}: WorkClockProps) {
  const timeString = `${String(todayTotal.hours).padStart(2, '0')}:${String(todayTotal.minutes).padStart(2, '0')}:${String(todayTotal.seconds).padStart(2, '0')}`;

  const isClockedIn = !!(todayEntry && isToday && !todayEntry.clockOut);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-900">
      {/* Main Time Display - Hero Section */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between min-h-[320px] shadow-2xs">
        <div>
          {/* Status Indicator */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className={`w-2.5 h-2.5 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${isClockedIn ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isClockedIn ? 'Currently Clocked In' : 'Ready to Clock In'}
            </span>
          </div>

          {/* Large Time Display */}
          <div className="space-y-1 mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              {isClockedIn ? 'Elapsed Professional Time' : 'Total Session Time'}
            </span>
            <div className="font-mono text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-none">
              {isToday ? timeString.slice(0, 5) : '00:00'}
              <span className="text-[#6E36E4] text-2xl sm:text-3xl ml-1 font-semibold">
                :{isToday ? timeString.slice(6) : '00'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isToday && (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            {todayEntry && !todayEntry.clockOut ? (
              <>
                <button
                  onClick={onClockOut}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Clock Out</span>
                </button>
                <button
                  onClick={onBreak}
                  className="bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100 font-bold px-5 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Take 5m Break</span>
                </button>
              </>
            ) : (
              <button
                onClick={onClockIn}
                className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Clock In Now</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Side Card: Daily Pulse */}
      <div className="lg:col-span-1 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
            <Clock className="w-4 h-4 text-[#6E36E4]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Daily Work Pulse
            </h4>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Session Duration</span>
              <span className="text-sm font-bold font-mono text-slate-900">
                {todayEntry && isToday
                  ? `${String(Math.floor((new Date().getTime() - new Date(todayEntry.clockIn).getTime()) / (1000 * 60))).padStart(2, '0')} mins`
                  : '--:--'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Current Status</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isClockedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-slate-100 text-slate-600'
              }`}>
                {todayEntry && isToday && todayEntry.clockOut ? 'Clocked Out' : todayEntry ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/60 mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Daily Goal Progress</span>
            <span className="text-[#6E36E4]">
              {todayEntry && isToday ? `${Math.min(Math.floor((todayTotal.hours / 8) * 100), 100)}%` : '0%'}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6E36E4] rounded-full transition-all duration-500"
              style={{
                width: `${todayEntry && isToday ? Math.min((todayTotal.hours / 8) * 100, 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
