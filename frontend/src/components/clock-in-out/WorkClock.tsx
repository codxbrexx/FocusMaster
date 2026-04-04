import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Pause } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Time Display - Hero Section */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/10 p-10 flex flex-col justify-between min-h-[360px]">
        {/* Ambient Glow Background */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>

        <div className="relative z-10">
          {/* Status Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(92,253,128,0.8)]"></div>
            <span className="text-primary font-label tracking-widest uppercase text-xs font-bold">
              {todayEntry && isToday ? 'Currently Clocked In' : 'Ready to Clock In'}
            </span>
          </div>

          {/* Large Time Display */}
          <div className="flex flex-col mb-8">
            <span className="text-on-surface-variant font-label uppercase tracking-[0.2em] mb-2 text-xs">
              {todayEntry && isToday ? 'Elapsed Professional Time' : 'Total Time'}
            </span>
            <h3 className="font-headline text-[4rem] sm:text-[5rem] lg:text-[6rem] font-bold leading-none tracking-tighter text-on-background">
              {todayEntry && isToday ? timeString.slice(0, 5) : '00:00'}
              <span className="text-primary/50 text-2xl sm:text-3xl ml-2 tracking-normal font-medium">
                :{todayEntry && isToday ? timeString.slice(6) : '00'}
              </span>
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        {isToday && (
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            {todayEntry ? (
              <>
                <Button
                  onClick={onClockOut}
                  className="px-10 py-5 bg-primary text-on-primary-container font-headline font-bold text-lg rounded-xl flex items-center gap-3 transition-transform duration-150 border border-primary/20"
                >
                  <LogOut className="w-6 h-6" />
                  Clock Out
                </Button>
                <Button
                  onClick={onBreak}
                  variant="outline"
                  className="px-8 py-5 border border-outline-variant/30 text-secondary font-headline font-bold text-lg rounded-xl flex items-center gap-3 hover:bg-secondary/5 transition-all"
                >
                  <Pause className="w-5 h-5" />
                  Take a Break
                </Button>
              </>
            ) : (
              <Button
                onClick={onClockIn}
                className="px-10 py-5 bg-primary text-on-primary-container font-headline font-bold text-lg rounded-xl flex items-center gap-3 transition-transform duration-150 active:scale-95 shadow-lg shadow-primary/20"
              >
                <LogIn className="w-6 h-6" />
                Clock In
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Side Card: Daily Pulse - Corner Position */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-xl p-8 border border-outline-variant/10 flex-1 flex flex-col justify-center">
          <h4 className="text-on-surface-variant font-label uppercase tracking-widest text-xs mb-6">Daily Pulse</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-on-surface/80 text-sm">Session Duration</span>
              <span className="font-headline font-medium text-lg text-secondary-design">
                {todayEntry && isToday
                  ? `${String(Math.floor((new Date().getTime() - new Date(todayEntry.clockIn).getTime()) / (1000 * 60))).padStart(2, '0')} min`
                  : '--:-- --'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface/80 text-sm">Status</span>
              <span className="font-headline font-medium text-lg text-tertiary">
                {todayEntry && isToday && todayEntry.clockOut ? 'Clocked Out' : todayEntry ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="pt-4 border-t border-outline-variant/10">
              <div className="flex items-center justify-between text-sm text-on-surface-variant mb-2">
                <span>Daily Progress</span>
                <span>
                  {todayEntry && isToday ? `${Math.min(Math.floor((todayTotal.hours / 8) * 100), 100)}%` : '0%'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${todayEntry && isToday ? Math.min((todayTotal.hours / 8) * 100, 100) : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
