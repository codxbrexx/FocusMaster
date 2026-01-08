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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = open ? SIDEBAR_WIDTH : (isMobile ? 0 : SIDEBAR_WIDTH_COLLAPSED);

    return (
        <motion.aside
            initial={false}
            animate={{
                width: sidebarWidth,
                x: (isMobile && !open) ? -100 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => onOpenChange(!open)}
            className={cn(
                'h-screen fixed left-0 top-0 z-40 flex flex-col',
                'bg-background/60 backdrop-blur-2xl border-r border-white/5',
                (isMobile && !open) && 'border-none shadow-none'
            )}
        >
            {/* --- HEADER --- */}
            <div
                className={cn(
                    "h-24 flex items-center mb-2 relative group transition-all duration-300",
                    open ? "justify-between px-5" : "justify-center"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                >
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl group-hover:bg-purple-500/30 transition-all duration-500" />
                        <img
                            src="/fmasterlogo.png"
                            alt="FocusMaster"
                            className="relative w-10 h-10 shadow-2xl transition-transform duration-300 shrink-0 object-contain"
                        />
                    </div>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col"
                            >
                                <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500/80">
                                    FocusMaster
                                </h1>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-[10px] text-muted-foreground font-medium font-semibold uppercase tracking-widest">
                                        Pro Workspace
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- MENU ITEMS --- */}
            <div className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none py-4">
                {/* Toggle Button as Menu Item */}
                {!isMobile && (
                    <button
                        onClick={() => onOpenChange(!open)}
                        className={cn(
                            'flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-300 group overflow-hidden w-full text-left mb-1.5',
                            !open && 'justify-center px-2',
                            'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                        )}
                    >
                        <div className="relative z-10 flex items-center justify-center">
                            {open ? (
                                <PanelLeftClose className="w-[22px] h-[22px] text-muted-foreground/70 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
                            ) : (
                                <PanelLeftOpen className="w-[22px] h-[22px] text-muted-foreground/70 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
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

                {MENU_ITEMS.map((item) => (
                    <SidebarItem key={item.path} item={item} isOpen={open} />
                ))}
            </div>

            {/* --- FOOTER / PROFILE --- */}
            <div className="p-4 mt-auto border-t border-border/50 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm relative">
                <SidebarItem
                    item={{ path: '/settings', label: 'Settings', icon: Settings }}
                    isOpen={open}
                />

                <ProfileMenu isOpen={open} />
            </div>
        </motion.aside>
    );
};
