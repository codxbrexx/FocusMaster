import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  Palette,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getLevelInfo, getProgressPercent } from '@/utils/levelUtils';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userPoints = user?.points || 0;
  const level = getLevelInfo(userPoints);
  const progress = getProgressPercent(userPoints);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setShowTheme(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const themes = [
    { id: 'light' as const, label: 'Light', icon: Sun },
    { id: 'dark' as const, label: 'Dark', icon: Moon },
    { id: 'blue' as const, label: 'Navy', icon: Monitor },
  ];

  return (
    <header className="h-16 border-b border-border/40 bg-card/80 backdrop-blur-lg px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* LEFT — hamburger + clock */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden -ml-1 text-muted-foreground h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex flex-col gap-0">
          <span className="text-xl font-bold tracking-tight text-foreground tabular-nums leading-tight">
            {formatTime(currentTime)}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider hidden lg:block leading-tight">
            {formatDate(currentTime)}
          </span>
        </div>
      </div>

      {/* RIGHT — profile pill */}
      <div className="relative" ref={menuRef}>
        {/* Trigger */}
        <button
          onClick={() => { setIsMenuOpen(!isMenuOpen); setShowTheme(false); }}
          className={cn(
            'flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border transition-all duration-200',
            'hover:bg-accent/50',
            isMenuOpen
              ? 'bg-accent/60 border-border/80 shadow-sm'
              : 'bg-transparent border-border/30'
          )}
        >
          {/* Avatar + online dot */}
          <div className="relative shrink-0">
            <img
              src={user?.picture || '/profilelogo.png'}
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover border border-border/50"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full" />
          </div>

          {/* Name + level — hidden on small screens */}
          <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
            <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <span className={cn('text-[10px] font-bold uppercase tracking-wide', level.color)}>
              Lv.{level.level} {level.name}
            </span>
          </div>

          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 hidden sm:block',
              isMenuOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User card header */}
              <div className="p-4 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={user?.picture || '/profilelogo.png'}
                      alt="Profile"
                      className="w-11 h-11 rounded-xl object-cover border border-border/50"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.name || 'Guest User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    {/* Level progress bar */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn('h-full rounded-full bg-gradient-to-r transition-all', level.gradient)}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={cn('text-[10px] font-bold uppercase', level.color)}>
                        {level.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 space-y-0.5">
                <MenuItem icon={User} label="My Profile" onClick={() => handleNav('/profile')} />
                <MenuItem icon={Settings} label="Settings" onClick={() => handleNav('/settings')} />
                {user?.role === 'admin' && (
                  <MenuItem
                    icon={ShieldCheck}
                    label="Admin Panel"
                    onClick={() => handleNav('/admin')}
                    className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                    iconClass="text-amber-500"
                  />
                )}

                <div className="h-px bg-border/40 my-1 mx-1" />

                {/* Theme row */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTheme(!showTheme); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors">Theme</span>
                  </div>
                  <ChevronRight className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', showTheme && 'rotate-90')} />
                </button>

                <AnimatePresence>
                  {showTheme && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1.5 mx-1 mb-1 mt-0.5 rounded-xl">
                        {themes.map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={(e) => { e.stopPropagation(); setTheme(id); }}
                            className={cn(
                              'flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-semibold transition-all duration-200',
                              theme === id
                                ? id === 'blue'
                                  ? 'bg-[#020617] text-blue-400 shadow ring-1 ring-blue-500/30'
                                  : 'bg-background text-primary shadow ring-1 ring-border'
                                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="h-px bg-border/40 my-1 mx-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* ── Small reusable menu item ────────────────────────────── */
function MenuItem({
  icon: Icon,
  label,
  onClick,
  className,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  iconClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors group/item',
        className
      )}
    >
      <Icon className={cn('w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors', iconClass)} />
      {label}
    </button>
  );
}
