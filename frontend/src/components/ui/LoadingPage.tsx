import { useState, useEffect } from 'react';
import { useDevice } from '../../context/DeviceContext';

const LOADING_STATES = [
  'Initializing secure environment...',
  'Syncing preferences...',
  'Loading workspace...',
  'Preparing your dashboard...',
];

const QUOTES = [
  'Focus is the key to all high performance.',
  'The way to get started is to quit talking and begin doing.',
  'Productivity is never an accident.',
  'Effectiveness is doing the right things.',
];

interface LoadingPageProps {
  customMessage?: string;
}

export const LoadingPage = ({ customMessage }: LoadingPageProps) => {
  const { deviceType, capabilities } = useDevice();
  const [statusIndex, setStatusIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Adjust messages based on device
  const displayMessage =
    customMessage ||
    (deviceType === 'mobile'
      ? 'Initializing mobile optimizations...'
      : 'Preparing desktop workspace...');

  useEffect(() => {
    // Cycle states
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < LOADING_STATES.length - 1 ? prev + 1 : prev));
    }, 800);

    // Cycle quotes
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl transition-all duration-500">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-matrix opacity-20 pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full p-6 text-center z-10">
        {/* CSS-Only Spinner */}
        <div className="relative w-20 h-20 mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted/20"
            />
            {/* Animated Ring using CSS Dashoffset */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              className="origin-center animate-[spin_1.5s_linear_infinite]"
              style={{
                strokeDasharray: 251, // 2 * PI * 40
                strokeDashoffset: 60, // Partial circle
              }}
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner Pulse Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_hsl(var(--primary))] animate-pulse" />
          </div>
        </div>

        {/* Status Text - Monospace */}
        <div className="h-8 flex items-center justify-center w-full overflow-hidden mb-2">
          <span className="font-mono text-sm text-foreground/80 tracking-wide animate-fade-in key={statusIndex}">
            {customMessage
              ? customMessage
              : statusIndex === 0
                ? displayMessage
                : LOADING_STATES[statusIndex]}
          </span>
          {capabilities.connection === 'slow' && (
            <div className="absolute top-full mt-2 text-xs text-yellow-500 font-medium">
              Slow connection detected. Loading optimized assets...
            </div>
          )}
        </div>

        {/* Progress Bar Line */}
        <div className="w-48 h-0.5 bg-muted/30 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent animate-[width_3s_ease-in-out_forwards] w-0"
            style={{ animationName: 'growWidth' }}
          />
        </div>

        {/* Quote */}
        <div className="h-10 relative flex items-center justify-center max-w-xs px-4">
          <p
            key={quoteIndex}
            className="text-xs text-muted-foreground/50 font-light italic animate-[fadeUp_0.5s_ease-out]"
          >
            "{QUOTES[quoteIndex]}"
          </p>
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <style>{`
                @keyframes growWidth {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
};
