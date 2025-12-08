import { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from './ui/button';

export function TopBar() {
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

  /* const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pomodoro', label: 'Focus', icon: Timer }, // Changed label to Focus for clarity
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'clock', label: 'Time Log', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'spotify', label: 'Music', icon: Music },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const; */

  return (
    <header className="h-20 border-b border-border/40 bg-card/50 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-0.5">
          <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums leading-none">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:block">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Navigation - Centered relative to the remaining space or left aligned next to time */}
        {/* <nav className="hidden md:flex items-center gap-1 ml-4 bg-secondary/30 p-1 rounded-full border border-border/50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
                currentView === item.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-4 h-4", currentView === item.id && "fill-current")} />
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </nav> */}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-8 w-px bg-border/60 mx-1 hidden md:block" />

        <div className="flex items-center gap-1.5">
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
        </div>
      </div>
    </header>
  );
}
