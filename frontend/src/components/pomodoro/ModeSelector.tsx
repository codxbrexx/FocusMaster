import { Brain, Coffee } from 'lucide-react';
import type { TimerMode } from '@/store/useTimerStore';

interface ModeSelectorProps {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  resetTimer: () => void;
}

export const ModeSelector = ({ mode, setMode, resetTimer }: ModeSelectorProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-8 bg-secondary/50 p-1 rounded-xl">
      {[
        { id: 'pomodoro', icon: Brain, label: 'Focus' },
        { id: 'short-break', icon: Coffee, label: 'Short' },
        { id: 'long-break', icon: Coffee, label: 'Long' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setMode(item.id as TimerMode);
            resetTimer();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === item.id
              ? 'bg-background shadow-sm text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </div>
  );
};
