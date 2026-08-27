import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  status: string;
  handleStart: () => void;
  handlePause: () => void;
  handleReset: () => void;
}

export const TimerControls = ({
  status,
  handleStart,
  handlePause,
  handleReset,
}: TimerControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-6 font-sans">
      {/* Reset */}
      <button
        id="timer-reset"
        onClick={handleReset}
        title="Reset timer"
        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Primary Action Button */}
      {status !== 'running' ? (
        <button
          id="timer-start"
          onClick={handleStart}
          className="h-12 px-8 rounded-2xl flex items-center justify-center gap-2.5 bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Session</span>
        </button>
      ) : (
        <button
          id="timer-pause"
          onClick={handlePause}
          className="h-12 px-8 rounded-2xl flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
        >
          <Pause className="w-4 h-4" />
          <span>Pause</span>
        </button>
      )}

      {/* Skip */}
      <button
        id="timer-skip"
        onClick={handleReset}
        title="Skip session"
        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer"
      >
        <SkipForward className="w-5 h-5" />
      </button>
    </div>
  );
};
