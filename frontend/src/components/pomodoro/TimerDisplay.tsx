import type { TimerMode } from '@/store/useTimerStore';

interface TimerDisplayProps {
  mode: TimerMode;
  timeLeft: number;
  totalDuration: number;
  progress: number;
  status: string;
  formatTime: (seconds: number) => string;
}

const MODE_CONFIG: Record<TimerMode, {
  label: string;
  ringColor: string;
  statusColor: string;
  tagBg: string;
  tagText: string;
  motivation: string;
}> = {
  pomodoro: {
    label: 'Focus Session',
    ringColor: '#7C3AED',   // violet-600
    statusColor: 'text-violet-500 dark:text-violet-400',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-600 dark:text-violet-400',
    motivation: 'Stay focused. Every minute counts.',
  },
  'short-break': {
    label: 'Short Break',
    ringColor: '#10B981',   // emerald-500
    statusColor: 'text-emerald-500 dark:text-emerald-400',
    tagBg: 'bg-emerald-500/10',
    tagText: 'text-emerald-600 dark:text-emerald-400',
    motivation: "Rest well. You've earned it.",
  },
  'long-break': {
    label: 'Long Break',
    ringColor: '#0EA5E9',   // sky-500
    statusColor: 'text-sky-500 dark:text-sky-400',
    tagBg: 'bg-sky-500/10',
    tagText: 'text-sky-600 dark:text-sky-400',
    motivation: 'Take a proper break. Recharge fully.',
  },
};

export const TimerDisplay = ({ mode, timeLeft, progress, status, formatTime }: TimerDisplayProps) => {
  const cfg = MODE_CONFIG[mode];

  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress / 100);

  // Estimated finish time
  const finishDate = new Date(Date.now() + timeLeft * 1000);
  const finishStr = finishDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const statusLabel =
    status === 'idle' ? 'READY' :
    status === 'paused' ? 'PAUSED' :
    mode === 'pomodoro' ? 'FOCUSING' : 'RESTING';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Ring container - scales on mobile up to max sizes */}
      <div className="relative flex items-center justify-center w-[75vw] h-[75vw] max-w-[280px] max-h-[280px] sm:max-w-[320px] sm:max-h-[320px] lg:max-w-[340px] lg:max-h-[340px]">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle cx="50" cy="50" r={r} stroke="currentColor" strokeWidth="4" fill="none" className="text-secondary" />
          {/* Progress — color matches active mode */}
          <circle
            cx="50" cy="50" r={r}
            stroke={cfg.ringColor}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${cfg.ringColor}55)` }}
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Inner text */}
        <div className="relative z-10 flex flex-col items-center justify-center select-none gap-1">
          {/* Mode tag pill */}
          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${cfg.tagBg} ${cfg.tagText}`}>
            {cfg.label}
          </span>

          {/* Digits */}
          <span
            id="timer-display"
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight tabular-nums text-foreground leading-none mt-1 sm:mt-2"
          >
            {formatTime(timeLeft)}
          </span>

          {/* Status */}
          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] mt-0.5 sm:mt-1 ${cfg.statusColor}`}>
            {statusLabel}
          </span>

          {/* Estimated finish */}
          {status === 'running' && (
            <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 mt-0.5">
              ends at {finishStr}
            </span>
          )}
        </div>
      </div>

      {/* Motivational line */}
      <p className={`mt-3 text-xs font-medium tracking-wide text-center ${cfg.tagText} opacity-70`}>
        {cfg.motivation}
      </p>
    </div>
  );
};
