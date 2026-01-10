import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="h-20 border-b border-border/40 bg-card/50 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden -ml-2 text-muted-foreground"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex flex-col gap-0.5">
          <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums leading-none">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:block">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-8 w-px bg-border/60 mx-1 hidden md:block" />

        {/* <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/60 text-muted-foreground hover:text-foreground relative transition-all duration-200 hover:scale-110"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-card animate-pulse" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
          >
            <User className="w-4 h-4" />
          </Button>
        </div> */}
      </div>
    </header>
  );
}
