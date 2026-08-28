import { useState } from 'react';
import type { TimerMode } from '@/store/useTimerStore';

interface TimerDisplayProps {
  mode: TimerMode;
  timeLeft: number;
  totalDuration: number;
  progress: number;
  status: string;
  formatTime: (seconds: number) => string;
}

const MODE_CONFIG: Record<
  TimerMode,
  {
    label: string;
    ringColor: string;
    statusColor: string;
    tagBg: string;
    tagText: string;
    motivation: string;
  }
> = {
  pomodoro: {
    label: 'Deep Focus Session',
    ringColor: '#6E36E4',
    statusColor: 'text-[#6E36E4]',
    tagBg: 'bg-purple-50 border border-purple-100',
    tagText: 'text-[#6E36E4]',
    motivation: 'Stay focused. Deep work creates high value.',
  },
  'short-break': {
    label: 'Short Break',
    ringColor: '#10B981',
    statusColor: 'text-emerald-600',
    tagBg: 'bg-emerald-50 border border-emerald-100',
    tagText: 'text-emerald-700',
    motivation: "Rest well. You've earned a breather.",
  },
  'long-break': {
    label: 'Long Break',
    ringColor: '#0EA5E9',
    statusColor: 'text-sky-600',
    tagBg: 'bg-sky-50 border border-sky-100',
    tagText: 'text-sky-700',
    motivation: 'Step away and recharge completely.',
  },
};

function FinishTimeDisplay({ timeLeft }: { timeLeft: number }) {
  const [initialNow] = useState(() => Date.now());
  const finishDate = new Date(initialNow + timeLeft * 1000);
  const finishStr = finishDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <span className="text-[11px] font-semibold font-mono text-slate-400 mt-1">
      Ends at {finishStr}
    </span>
  );
}

export const TimerDisplay = ({
  mode,
  timeLeft,
  totalDuration: _totalDuration,
  progress,
  status,
  formatTime,
}: TimerDisplayProps) => {
  const cfg = MODE_CONFIG[mode];

  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress / 100);

  const statusLabel =
    status === 'idle'
      ? 'READY'
      : status === 'paused'
        ? 'PAUSED'
        : mode === 'pomodoro'
          ? 'FOCUSING'
          : 'RESTING';

  return (
    <div className="flex flex-col items-center w-full font-sans">
      {/* Progress Ring Container */}
      <div className="relative flex items-center justify-center w-[75vw] h-[75vw] max-w-[280px] max-h-[280px] sm:max-w-[320px] sm:max-h-[320px]">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="#F1F5F9"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke={cfg.ringColor}
            strokeWidth="4.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Center Display */}
        <div className="relative z-10 flex flex-col items-center justify-center select-none gap-1">
          {/* Mode Pill */}
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${cfg.tagBg} ${cfg.tagText}`}
          >
            {cfg.label}
          </span>

          {/* Time Monospace Digits */}
          <span
            id="timer-display"
            className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-slate-900 leading-none mt-2"
          >
            {formatTime(timeLeft)}
          </span>

          {/* Status Label */}
          <span
            className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${cfg.statusColor}`}
          >
            {statusLabel}
          </span>

          {/* Estimated Finish Time */}
          {status === 'running' && <FinishTimeDisplay timeLeft={timeLeft} />}
        </div>
      </div>

      {/* Motivational Tagline */}
      <p className="mt-4 text-xs font-semibold text-slate-500 text-center max-w-sm">
        {cfg.motivation}
      </p>
    </div>
  );
};
