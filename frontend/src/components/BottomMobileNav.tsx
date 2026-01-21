import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Timer, ListTodo, Calendar, Settings, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-white/5 lg:hidden safe-area-bottom pb-safe shadow-[0_-10px_10px_-15px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-6 h-[72px] w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-w-0 group"
            >
              {/* Active Indicator Backdrop */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 top-1 bottom-1 mx-1 bg-purple-500/40  rounded-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex flex-col items-center gap-0.5 transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                <div className="relative p-1">
                  <item.icon
                    className={cn(
                      'w-6 h-6 transition-all duration-300',
                      isActive && 'scale-110 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                <span className="h-3 text-[10px] font-medium tracking-wide overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {isActive && (
                      <motion.span
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </div>

              {/* Tap Highlight */}
              <div className="absolute inset-0 rounded-2xl active:bg-white/5 transition-colors duration-100" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
