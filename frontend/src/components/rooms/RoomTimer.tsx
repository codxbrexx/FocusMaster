import { Play, Pause, RotateCcw, Coffee, Flame, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const isFocus = timer.mode === 'focus';

  // Circle SVG metrics
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-white text-[#191918] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6 overflow-hidden border border-[#E6E4DF]">
      {/* Radial Soft Ambient Glow */}
      <div
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30 ${
          isFocus ? 'bg-indigo-100' : 'bg-emerald-100'
        }`}
      />
      <div
        className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30 ${
          isFocus ? 'bg-blue-100' : 'bg-teal-100'
        }`}
      />

      {/* Mode & Live Sync Badge */}
      <div className="flex items-center gap-3 z-10">
        <div
          className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full border shadow-2xs ${
            isFocus
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {isFocus ? <Flame className="w-4 h-4 text-indigo-600" /> : <Coffee className="w-4 h-4 text-emerald-600" />}
          <span>{timer.mode} Session</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#F4F4F0] text-[#191918] border border-[#E6E4DF]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synced Live</span>
        </div>
      </div>

      {/* Hero Radial Timer SVG Clock */}
      <div className="relative flex items-center justify-center my-2 z-10">
        <svg className="w-64 h-64 transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-[#E6E4DF]"
            fill="transparent"
          />
          {/* Progress Animated Ring */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke={isFocus ? 'url(#focusGradient)' : 'url(#breakGradient)'}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#191918" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Clock Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-[#191918]">
            {formatTime(timer.timeLeft)}
          </span>
          <span className="text-[11px] font-semibold text-[#9C9A92] mt-1 uppercase tracking-wider">
            {timer.isActive ? 'Active Ticking' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Bonus XP Reward Banner */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium z-10">
        <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
        <span>Co-working Bonus: Earn +15 XP on session complete!</span>
      </div>

      {/* Controls Area */}
      <div className="flex items-center gap-3 pt-2 z-10">
        {isHost ? (
          <>
            {timer.isActive ? (
              <Button
                size="lg"
                onClick={pauseRoomTimer}
                className="gap-2 bg-white hover:bg-[#F4F4F0] text-[#191918] border border-[#E6E4DF] font-medium px-6 shadow-xs"
              >
                <Pause className="w-5 h-5 fill-current" />
                Pause Session
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => startRoomTimer(25)}
                className="gap-2 bg-[#191918] hover:bg-[#333330] text-white font-medium px-8 shadow-sm"
              >
                <Play className="w-5 h-5 fill-current" />
                {timer.timeLeft === timer.totalDuration ? 'Start Focus Session' : 'Resume Session'}
              </Button>
            )}

            <Button
              size="icon"
              variant="outline"
              onClick={() => startRoomTimer(25)}
              title="Reset Timer to 25m"
              className="bg-white hover:bg-[#F4F4F0] text-[#191918] border-[#E6E4DF]"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4F4F0] text-[#666560] text-xs font-medium border border-[#E6E4DF]">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Host controls room timer parameters</span>
          </div>
        )}
      </div>
    </div>
  );
}
