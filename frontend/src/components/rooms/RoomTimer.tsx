import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/store/useRoomStore';

export function RoomTimer() {
  const { timer, startRoomTimer, pauseRoomTimer, activeRoom } = useRoomStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, ((timer.totalDuration - timer.timeLeft) / timer.totalDuration) * 100)
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 text-white rounded-2xl shadow-xl space-y-6 relative overflow-hidden border border-slate-800">
      {/* Top Banner */}
      <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="capitalize">{timer.mode} Session</span>
      </div>

      {/* Synchronized Timer Clock Display */}
      <div className="relative font-mono text-6xl md:text-7xl font-extrabold tracking-wider text-slate-50">
        {formatTime(timer.timeLeft)}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls (Host & Room Members) */}
      <div className="flex items-center gap-3 pt-2">
        {timer.isActive ? (
          <Button
            size="lg"
            variant="outline"
            onClick={pauseRoomTimer}
            className="gap-2 bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
          >
            <Pause className="w-5 h-5 fill-current" />
            Pause Timer
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => startRoomTimer(25)}
            className="gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Room Focus
          </Button>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Timer is synchronized live for all participants in {activeRoom?.name || 'this room'}.
      </p>
    </div>
  );
}
