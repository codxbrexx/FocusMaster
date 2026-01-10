import {
  LayoutDashboard,
  Timer,
  ListTodo,
  BarChart2,
  Clock,
  Calendar as CalendarIcon,
  Music,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '@/context/DeviceContext';
import { useAuth } from '@/context/AuthContext';
import { SidebarItem } from './SidebarItem';
import { ProfileMenu } from './ProfileMenu';

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
  const navigate = useNavigate();
  const { deviceType } = useDevice();
  const { user } = useAuth();
  const isMobile = deviceType === 'mobile'; // Tablet treats as desktop (Mini mode support)

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
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      className={cn(
        'h-screen fixed left-0 top-0 z-40 flex flex-col',
        'bg-background/80 backdrop-blur-2xl border-r border-white/10 shadow-lg',
        isMobile && 'border-none'
      )}
      onClick={() => !isMobile && onOpenChange(!open)}
    >
      {/* --- HEADER --- */}
      <div
        className={cn(
          'h-28 flex items-center mb-2 relative group transition-all duration-300 z-10',
          open ? 'justify-between px-6' : 'justify-center'
        )}
      >
        <div
          className="flex items-center gap-5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/dashboard');
          }}
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/40 blur-2xl group-hover:bg-primary/50 transition-all duration-500 rounded-full" />
            <img
              src="/fmasterlogo.png"
              alt="FocusMaster"
              className="relative w-12 h-12 shadow-2xl transition-transform duration-300 shrink-0 object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
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
      <div className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {MENU_ITEMS.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isOpen={open}
            onClick={() => isMobile && onOpenChange(false)}
          />
        ))}

        {/* Toggle Button Moved to Bottom */}
        {!isMobile && (
          <button
            onClick={() => onOpenChange(!open)}
            className={cn(
              'flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-300 group overflow-hidden w-full text-left mt-auto',
              !open && 'justify-center px-2',
              'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
            )}
          >
            <div className="relative z-10 flex items-center justify-center">
              {open ? (
                <PanelLeftClose
                  className="w-[22px] h-[22px] text-muted-foreground/70 group-hover:text-foreground group-hover:scale-110 transition-all duration-300"
                  strokeWidth={2}
                />
              ) : (
                <PanelLeftOpen
                  className="w-[22px] h-[22px] text-muted-foreground/70 group-hover:text-foreground group-hover:scale-110 transition-all duration-300"
                  strokeWidth={2}
                />
              )}
            </div>

            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 text-sm font-medium tracking-wide whitespace-nowrap ml-3.5"
                >
                  Close Sidebar
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>

      {/* --- FOOTER / PROFILE --- */}
      <div
        className="p-4 mt-auto border-t border-border/50 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <SidebarItem
          item={{ path: '/settings', label: 'Settings', icon: Settings }}
          isOpen={open}
        />

        <div className="mt-2 pt-2 border-t border-primary/50">
          <ProfileMenu isOpen={open} />
        </div>
      </div>
    </motion.aside>
  );
};
