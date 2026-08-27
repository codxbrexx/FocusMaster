import {
  LayoutDashboard,
  Timer,
  ListTodo,
  BarChart2,
  Clock,
  Calendar as CalendarIcon,
  Music,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Trophy,
  User,
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '@/context/DeviceContext';
import { useAuth } from '@/context/AuthContext';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { path: '/rooms', label: 'Focus Rooms', icon: Users },
  { path: '/leaderboard', label: 'Leaderboards', icon: Trophy },
  { path: '/clock', label: 'Clock In/Out', icon: Clock },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/study', label: 'Study AI', icon: BookOpen },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { path: '/spotify', label: 'Spotify', icon: Music },
];

const SIDEBAR_WIDTH = 260;
const SIDEBAR_WIDTH_COLLAPSED = 76;

export const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const navigate = useNavigate();
  const { deviceType } = useDevice();
  const { user } = useAuth();
  const isScreenSmall = useMediaQuery('(max-width: 1023px)');
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet' || isScreenSmall;

  const sidebarVariants = {
    desktop: {
      width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED,
      x: 0,
      opacity: 1,
    },
    mobileOpen: {
      width: SIDEBAR_WIDTH,
      x: 0,
      opacity: 1,
    },
    mobileClosed: {
      width: SIDEBAR_WIDTH,
      x: '-100%',
      opacity: 0,
    },
  };

  const currentVariant = isMobile ? (open ? 'mobileOpen' : 'mobileClosed') : 'desktop';

  return (
    <motion.aside
      initial={false}
      animate={currentVariant}
      variants={sidebarVariants}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 26,
        opacity: { duration: 0.2 },
      }}
      className={cn(
        'h-screen fixed left-0 top-0 z-40 flex flex-col font-sans border-r border-slate-200/80 bg-white shadow-2xs text-slate-900',
        isMobile && 'w-full max-w-[280px]'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-slate-100 relative group transition-all duration-300 shrink-0',
          open ? 'justify-between px-5' : 'justify-center'
        )}
      >
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/dashboard');
          }}
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <img
              src="/FM_logo.png"
              alt="FocusMaster Logo"
              className="w-8 h-8 transition-transform duration-300 shrink-0 object-contain group-hover:scale-105"
            />
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col min-w-0"
              >
                <h1 className="font-bold text-base tracking-tight text-slate-900 leading-tight">
                  FocusMaster
                </h1>
                <span className="text-[9px] text-[#6E36E4] font-bold uppercase tracking-wider">
                  Deep Work Workspace
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
        {/* Admin Link */}
        {user?.role === 'admin' && (
          <SidebarItem
            item={{ path: '/admin', label: 'Admin Panel', icon: ShieldCheck }}
            isOpen={open}
            onClick={() => isMobile && onOpenChange(false)}
          />
        )}

        {MENU_ITEMS.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isOpen={open}
            onClick={() => isMobile && onOpenChange(false)}
          />
        ))}
      </div>

      {/* Footer Profile & Settings Shortcuts */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0 space-y-1">
        <SidebarItem
          item={{ path: '/profile', label: 'My Profile', icon: User }}
          isOpen={open}
          onClick={() => isMobile && onOpenChange(false)}
        />
        <SidebarItem
          item={{ path: '/settings', label: 'Settings', icon: SettingsIcon }}
          isOpen={open}
          onClick={() => isMobile && onOpenChange(false)}
        />
      </div>

      {/* Edge Collapse Trigger */}
      {!isMobile && (
        <button
          aria-label={open ? 'Close Sidebar' : 'Open Sidebar'}
          onClick={() => onOpenChange(!open)}
          className="absolute top-1/2 -translate-y-1/2 -right-3.5 w-7 h-7 flex items-center justify-center bg-white border border-slate-200/80 rounded-full shadow-2xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all z-50 cursor-pointer"
        >
          {open ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </motion.aside>
  );
};
