import { useState, useEffect } from 'react';
import { useDevice } from '../../context/DeviceContext';
import loaderSvg from '@/assets/loader.svg';

const LOADING_STATES = [
  'Initializing secure environment...',
  'Syncing preferences...',
  'Loading workspace...',
  'Preparing your dashboard...',
];

interface LoadingPageProps {
  customMessage?: string;
}

export const LoadingPage = ({ customMessage }: LoadingPageProps) => {
  const { deviceType, capabilities } = useDevice();
  const [statusIndex, setStatusIndex] = useState(0);

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

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl transition-all duration-500">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-matrix opacity-20 pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full p-6 text-center z-10">
        {/* Loader SVG */}
        <div className="relative w-20 h-20 mb-8">
          <img src={loaderSvg} alt="Loading" className="w-full h-full" />
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
