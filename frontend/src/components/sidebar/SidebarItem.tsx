import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    item: {
        path: string;
        label: string;
        icon: LucideIcon;
    };
    isOpen: boolean;
    onClick?: () => void;
}

export const SidebarItem = ({ item, isOpen, onClick }: SidebarItemProps) => {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.path === '/'}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            className={({ isActive }) =>
                cn(
                    'relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-300 group overflow-hidden',
                    !isOpen && 'justify-center px-2',
                    isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                )
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <>
                            {/* Active Background with reduced opacity gradient */}
                            <motion.div
                                layoutId="sidebar-active-bg"
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent rounded-xl"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />

                            {/* Left Active Pill Indicator */}
                            <motion.div
                                layoutId="sidebar-active-pill"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-500 rounded-r-full shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 20 }}
                                exit={{ opacity: 0, height: 0 }}
                            />
                        </>
                    )}

                    <div className="relative z-10 flex items-center justify-center">
                        <Icon
                            className={cn(
                                'w-6 h-6 transition-all duration-300',
                                isActive
                                    ? 'text-purple-600 dark:text-purple-400 drop-shadow-sm'
                                    : 'text-muted-foreground/70 group-hover:text-foreground group-hover:scale-110'
                            )}
                            strokeWidth={isActive ? 2.5 : 2}
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
                                    'relative z-10 text-sm font-medium tracking-wide whitespace-nowrap',
                                    isActive ? 'font-semibold text-foreground' : ''
                                )}
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </>
            )}
        </NavLink>
    );
};
