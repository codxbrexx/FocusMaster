import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  status: string;
  handleStart: () => void;
  handlePause: () => void;
  handleReset: () => void;
}

export const TimerControls = ({ status, handleStart, handlePause, handleReset }: TimerControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Reset */}
      <button
        id="timer-reset"
        onClick={handleReset}
        title="Reset timer"
        className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 border border-border/40"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Start / Pause */}
      {status !== 'running' ? (
        <button
          id="timer-start"
          onClick={handleStart}
          className="h-12 w-40 rounded-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 hover:scale-[1.03] shadow-sm hover:shadow-md"
        >
          <Play className="w-4 h-4 fill-current" />
          Start
        </button>
      ) : (
        <button
          id="timer-pause"
          onClick={handlePause}
          className="h-12 w-40 rounded-full flex items-center justify-center gap-2.5 border-2 border-border bg-card hover:bg-secondary text-foreground font-semibold text-sm transition-all duration-200 hover:scale-[1.03] hover:shadow-md"
        >
          <Pause className="w-4 h-4" />
          Pause
        </button>
      )}

      {/* Skip */}
      <button
        id="timer-skip"
        onClick={handleReset}
        title="Skip session"
        className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 border border-border/40"
      >
        <SkipForward className="w-5 h-5" />
      </button>
    </div>
  );
};
