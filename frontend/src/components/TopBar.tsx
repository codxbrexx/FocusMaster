import { useState, useEffect } from 'react';
import { Menu, User, Settings, LogOut, Sun, Moon, Monitor, ShieldCheck, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAppearance, setShowAppearance] = useState(false);

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
          <Menu className="w-16 h-16" />
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

        {/* Mobile Profile Menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer">
                <img
                  src={user?.picture || '/profilelogo.png'}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-border/50 object-cover shadow-sm"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full"></div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/50">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Guest User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <ShieldCheck className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center justify-between cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setShowAppearance(!showAppearance);
                }}
              >
                <div className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Theme</span>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    showAppearance && 'rotate-90'
                  )}
                />
              </DropdownMenuItem>

              <AnimatePresence>
                {showAppearance && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-1"
                  >
                    <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1 mb-2 mt-1 rounded-lg">
                      {(['light', 'dark', 'blue'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTheme(t);
                          }}
                          className={cn(
                            'flex items-center justify-center py-1.5 rounded-md transition-all duration-200',
                            theme === t
                              ? t === 'blue'
                                ? 'bg-[#020617] text-blue-400 shadow-sm ring-1 ring-blue-500/30'
                                : 'bg-background text-primary shadow-sm ring-1 ring-border'
                              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                          )}
                          title={t === 'blue' ? 'Navy' : t.charAt(0).toUpperCase() + t.slice(1)}
                        >
                          {t === 'light' && <Sun className="w-4 h-4" />}
                          {t === 'dark' && <Moon className="w-4 h-4" />}
                          {t === 'blue' && <Monitor className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
