import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
    className?: string;
    size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[100px]">
            <div className="flex flex-col items-center gap-2">
                <Loader2
                    className={cn("animate-spin text-primary", className)}
                    size={size}
                />
                <p className="text-xs text-muted-foreground animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
