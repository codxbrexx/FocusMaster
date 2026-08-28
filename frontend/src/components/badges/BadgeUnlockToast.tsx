import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Trophy } from 'lucide-react';
import { useBadgeStore } from '@/store/useBadgeStore';

export function BadgeUnlockToast() {
  const { recentUnlockedBadge, clearRecentBadge } = useBadgeStore();

  useEffect(() => {
    if (recentUnlockedBadge) {
      const timer = setTimeout(() => {
        clearRecentBadge();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlockedBadge, clearRecentBadge]);

  return (
    <AnimatePresence>
      {recentUnlockedBadge && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white text-slate-900 rounded-2xl p-5 shadow-xl border border-slate-200/80 overflow-hidden font-sans"
        >
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                <Trophy className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Achievement Unlocked!</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {recentUnlockedBadge.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {recentUnlockedBadge.description}
                </p>
              </div>
            </div>

            <button
              onClick={clearRecentBadge}
              className="text-slate-400 hover:text-slate-700 transition p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="capitalize text-amber-700 font-bold bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
              {recentUnlockedBadge.tier} Tier Trophy
            </span>
            <div className="flex items-center gap-1 text-slate-600">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Added to your shelf</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
