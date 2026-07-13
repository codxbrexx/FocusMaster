import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Timer, ListTodo, Calendar, Settings, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const BottomMobileNav = () => {
  const location = useLocation();

  const NAV_ITEMS = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: ListTodo },
    { path: '/pomodoro', label: 'Focus', icon: Timer },
    { path: '/analytics', label: 'Analysis', icon: BarChart2 },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/settings', label: 'Setting', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border lg:hidden safe-area-bottom pb-safe shadow-[0_-8px_16px_rgba(0,0,0,0.4)]">
      <div className="grid grid-cols-6 h-[58px] w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-w-0"
            >
              {/* Active Indicator Backdrop */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-x-1.5 top-1.5 bottom-1.5 bg-primary rounded-xl shadow-[0_2px_8px_rgba(124,58,237,0.3)]"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 28,
                  }}
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex flex-col items-center gap-0.5 transition-colors duration-200',
                  isActive ? 'text-primary-foreground font-semibold' : 'text-muted-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'w-[18px] h-[18px] transition-all duration-300',
                    isActive && 'scale-105'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[9px] font-bold tracking-wide">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
