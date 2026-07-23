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

import { BookOpen } from 'lucide-react';

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { path: '/clock', label: 'Clock In/Out', icon: Clock },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/study', label: 'Study AI', icon: BookOpen },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { path: '/spotify', label: 'Spotify', icon: Music },
];

const SIDEBAR_WIDTH = 280;
const SIDEBAR_WIDTH_COLLAPSED = 80;

export const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const navigate = useNavigate();
  const { deviceType } = useDevice();
  const { user } = useAuth();
  const isScreenSmall = useMediaQuery('(max-width: 1023px)');
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet' || isScreenSmall;

  // Desktop: Width animates 280 <-> 80
  // Mobile:  Width is fixed 280, X animates 0 <-> -100%
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
        damping: 24,
        opacity: { duration: 0.2 },
      }}
      className={cn(
        'h-screen fixed left-0 top-0 z-40 flex flex-col',
        'bg-background/80 backdrop-blur-2xl border-r border-border/40',
        isMobile && 'bg-card/95 backdrop-blur-3xl border-r border-border w-full max-w-[80vw]'
      )}
      onClick={() => !isMobile && onOpenChange(!open)}
    >
      {/* --- HEADER --- */}
      <div
        className={cn(
          'h-14 lg:h-16 flex items-center mb-2 relative group transition-all duration-300 z-10',
          open ? 'justify-between px-6' : 'justify-center'
        )}
      >
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/dashboard');
          }}
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/40 blur-2xl group-hover:bg-primary/50 transition-all duration-500 rounded-full" />
            <img
              src="/FM_logo.png"
              alt="FocusMaster"
              className="relative w-14 h-14 shadow-2xl transition-transform duration-300 shrink-0 object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            />
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500/80">
                  FocusMaster
                </h1>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                    Pro Workspace
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- MENU ITEMS --- */}

      {/* Admin Link */}
      {user?.role === 'admin' && (
        <SidebarItem
          item={{ path: '/admin', label: 'Admin Panel', icon: ShieldCheck }}
          isOpen={open}
          onClick={() => isMobile && onOpenChange(false)}
        />
      )}
      <div className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none pb-4">
        {MENU_ITEMS.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isOpen={open}
            onClick={() => isMobile && onOpenChange(false)}
          />
        ))}

      </div>

      {/* Edge Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => onOpenChange(!open)}
          className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 flex items-center justify-center bg-card border border-border/50 rounded-full shadow-lg text-muted-foreground hover:text-foreground hover:border-border transition-all z-50 group hover:shadow-primary/20"
        >
          {open ? (
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      )}

    </motion.aside>
  );
};
