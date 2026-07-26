import { Brain, Coffee, Armchair } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TimerMode } from '@/store/useTimerStore';

interface ModeSelectorProps {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  resetTimer: () => void;
}

const MODES: {
  id: TimerMode;
  icon: LucideIcon;
  label: string;
  activeClasses: string;
  dotColor: string;
}[] = [
  {
    id: 'pomodoro',
    icon: Brain,
    label: 'Focus',
    activeClasses: 'bg-violet-600 text-white shadow-md shadow-violet-500/30 border-violet-700',
    dotColor: 'bg-violet-400',
  },
  {
    id: 'short-break',
    icon: Coffee,
    label: 'Short Break',
    activeClasses: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border-emerald-600',
    dotColor: 'bg-emerald-400',
  },
  {
    id: 'long-break',
    icon: Armchair,
    label: 'Long Break',
    activeClasses: 'bg-sky-500 text-white shadow-md shadow-sky-500/30 border-sky-600',
    dotColor: 'bg-sky-400',
  },
];

export const ModeSelector = ({ mode, setMode, resetTimer }: ModeSelectorProps) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl border border-border/40">
      {MODES.map(({ id, icon: Icon, label, activeClasses }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            id={`mode-${id}`}
            onClick={() => { setMode(id); resetTimer(); }}
            className={`
              flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold
              transition-all duration-200 border
              ${active
                ? `${activeClasses}`
                : 'text-muted-foreground hover:text-foreground hover:bg-card/60 border-transparent'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
