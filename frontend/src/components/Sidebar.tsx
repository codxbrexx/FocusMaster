import {
  LayoutDashboard,
  Timer,
  ListTodo,
  BarChart2,
  Clock,
  Calendar as CalendarIcon,
  Music,
  Settings,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { path: '/clock', label: 'Clock In/Out', icon: Clock },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { path: '/spotify', label: 'Spotify', icon: Music },
];

const SIDEBAR_WIDTH = 280;
const SIDEBAR_WIDTH_COLLAPSED = 80;

export const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED }}
      animate={{ width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={() => onOpenChange(!open)}
      className={cn(
        'h-screen fixed left-0 top-0 z-40 flex flex-col',
        'bg-background/80 backdrop-blur-xl border-r border-border/40',
        'cursor-pointer'
      )}
    >
      <div className="h-20 flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="/fmasterlogo.png"
            alt="FocusMaster"
            className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 object-cover"
          />

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="font-bold text-lg tracking-tight">FocusMaster</h1>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <span className="text-purple-500">Pro</span> Edition
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {open && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            className="text-muted-foreground hover:bg-muted/50 rounded-full w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!open && (
        <div className="w-full flex justify-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(true);
            }}
            className="text-muted-foreground hover:bg-muted/50 rounded-full w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      )}

      <div className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-none">
        {MENU_ITEMS.map((item) => (
          <SidebarItem key={item.path} item={item} isOpen={open} />
        ))}
      </div>

      <div className="p-3 mt-auto border-t border-border/40 bg-gradient-to-t from-background to-transparent">
        <SidebarItem
          item={{ path: '/settings', label: 'Settings', icon: Settings }}
          isOpen={open}
        />

        <div
          className={cn(
            'mt-4 flex items-center gap-3 p-2 rounded-xl bg-muted/30 border border-border/50',
            !open && 'justify-center bg-transparent border-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={user?.picture || "/profilelogo.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full shrink-0 border-2 border-background object-cover"
          />
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium truncate">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email === 'guest@daylite.app' || user?._id === 'guest' ? 'Guest mode' : 'Free Plan'}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {open && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto hover:text-destructive"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

const SidebarItem = ({ item, isOpen }: { item: any; isOpen: boolean }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={(e) => e.stopPropagation()}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group',
          'hover:bg-muted/50',
          !isOpen && 'justify-center',
          isActive && 'bg-accent/50'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute inset-0 bg-primary/10 rounded-xl"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          <div className="relative z-10">
            <Icon
              className={cn(
                'w-5 h-5 transition-colors duration-300',
                isActive ? 'text-purple-600' : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'relative z-10 font-medium text-sm whitespace-nowrap',
                  isActive ? 'text-purple-600 font-semibold' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {isActive && isOpen && (
            <motion.div
              layoutId="active-nav-indicator"
              initial={{ height: 0 }}
              animate={{ height: 20 }}
              className="absolute right-0 w-1.5 rounded-l-full bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]"
            />
          )}
        </>
      )}
    </NavLink>
  );
};
