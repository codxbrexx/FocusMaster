import { cn } from '@/lib/utils';
import loaderSvg from '@/assets/loader.svg';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  message?: string;
}

export function LoadingSpinner({ className, size = 24, message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <div className="flex flex-col items-center gap-2">
        <img
          src={loaderSvg}
          alt="Loading"
          style={{ width: size, height: size }}
          className={cn('', className)}
        />
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
