import { Play, Pause, RotateCcw, Flame, Zap, ShieldCheck } from 'lucide-react';
import { useRoomStore } from '@/store/useRoomStore';
import { useAuth } from '@/context/AuthContext';

export function RoomTimer() {
  const { timer, startRoomTimer, pauseRoomTimer, activeRoom } = useRoomStore();
  const { user } = useAuth();

  const isHost = activeRoom?.host?._id === user?._id || (activeRoom?.host as any) === user?._id;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, ((timer.totalDuration - timer.timeLeft) / timer.totalDuration) * 100)
  );

  // SVG parameters matching TimerDisplay
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progressPercent / 100);

  return (
    <div className="relative flex flex-col items-center justify-center p-5 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-4 overflow-hidden text-slate-900">
      {/* Top Mode & Live Sync Badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-800 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-[#6E36E4]" />
          <span>{timer.mode} Session</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-800 text-[11px] font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synced Live</span>
        </div>
      </div>

      {/* Perfectly Proportioned Compact Circular Timer */}
      <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="#F1F5F9"
            strokeWidth="5"
            fill="none"
          />
          {/* Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="#6E36E4"
            strokeWidth="5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px rgba(110, 54, 228, 0.25))' }}
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Inner Text Display */}
        <div className="relative z-10 flex flex-col items-center justify-center select-none">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-slate-900 leading-none">
            {formatTime(timer.timeLeft)}
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6E36E4] mt-1.5">
            {timer.isActive ? 'FOCUSING' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* XP Bonus Banner */}
      <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-semibold">
        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
        <span>Co-working Bonus: Earn +15 XP on session complete!</span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2.5 pt-1">
        {isHost ? (
          <>
            {timer.isActive ? (
              <button
                onClick={pauseRoomTimer}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold px-5 py-2 rounded-xl text-xs shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Session</span>
              </button>
            ) : (
              <button
                onClick={() => startRoomTimer(25)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold px-5 py-2 rounded-xl text-xs shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{timer.timeLeft === timer.totalDuration ? 'Start Focus Session' : 'Resume Session'}</span>
              </button>
            )}

            <button
              onClick={() => startRoomTimer(25)}
              title="Reset Timer to 25m"
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 p-2 rounded-xl text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Host controls room timer parameters</span>
          </div>
        )}
      </div>
    </div>
  );
}
