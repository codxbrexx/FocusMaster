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
          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group overflow-hidden font-sans',
          !isOpen && 'justify-center px-2',
          isActive
            ? 'bg-purple-50 text-[#6E36E4] font-bold border border-purple-100/80 shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active-pill"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#6E36E4] rounded-r-full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 20 }}
              exit={{ opacity: 0, height: 0 }}
            />
          )}

          <div className="relative z-10 flex items-center justify-center shrink-0">
            <Icon
              className={cn(
                'w-5 h-5 transition-all duration-200',
                isActive
                  ? 'text-[#6E36E4]'
                  : 'text-slate-400 group-hover:text-slate-700 group-hover:scale-105'
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 text-xs tracking-tight whitespace-nowrap"
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
