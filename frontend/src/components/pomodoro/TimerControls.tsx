import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="flex items-center gap-4 mt-8">
      <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full w-12 h-12">
        <RotateCcw className="w-5 h-5" />
      </Button>
      {status !== 'running' ? (
        <Button
          onClick={handleStart}
          className="rounded-full w-32 h-12 text-lg shadow-lg shadow-primary/20"
        >
          <Play className="w-5 h-5 mr-2 fill-current" /> Start
        </Button>
      ) : (
        <Button
          onClick={handlePause}
          variant="outline"
          className="rounded-full w-32 h-12 text-lg border-2"
        >
          <Pause className="w-5 h-5 mr-2" /> Pause
        </Button>
      )}
    </div>
  );
};
