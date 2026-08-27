import { Brain, Coffee, Armchair, type LucideIcon } from 'lucide-react';
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
}[] = [
  {
    id: 'pomodoro',
    icon: Brain,
    label: 'Focus Session',
  },
  {
    id: 'short-break',
    icon: Coffee,
    label: 'Short Break',
  },
  {
    id: 'long-break',
    icon: Armchair,
    label: 'Long Break',
  },
];

export const ModeSelector = ({ mode, setMode, resetTimer }: ModeSelectorProps) => {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60 font-sans">
      {MODES.map(({ id, icon: Icon, label }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            id={`mode-${id}`}
            onClick={() => {
              setMode(id);
              resetTimer();
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
              transition-all duration-200 cursor-pointer
              ${
                active
                  ? 'bg-white text-[#6E36E4] shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
              }
            `}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#6E36E4]' : 'text-slate-400'}`} />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
