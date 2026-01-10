import type { TimerMode } from '@/store/useTimerStore';

interface TimerDisplayProps {
  mode: TimerMode;
  timeLeft: number;
  progress: number;
  status: string;
  formatTime: (seconds: number) => string;
}

export const TimerDisplay = ({
  mode,
  timeLeft,
  progress,
  status,
  formatTime,
}: TimerDisplayProps) => {
  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      <svg
        className="absolute w-full h-full transform -rotate-90 pointer-events-none"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="main-gradient-focus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="main-gradient-short-break" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="main-gradient-long-break" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-secondary/30"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={`url(#main-gradient-${mode === 'short-break' ? 'short-break' : mode === 'long-break' ? 'long-break' : 'focus'})`}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 45}
          strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
          strokeLinecap="round"
          className="transition-all duration-500 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span className="text-8xl font-black tabular-nums tracking-tighter text-foreground select-none">
          {formatTime(timeLeft)}
        </span>
        <span className="text-base font-medium text-muted-foreground/80 uppercase tracking-[0.2em] mt-4 select-none">
          {status === 'idle' ? 'Ready' : mode === 'pomodoro' ? 'Deep Work' : 'Recharging'}
        </span>
      </div>
    </div>
  );
};
