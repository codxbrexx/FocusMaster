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
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-amber-500/40 overflow-hidden"
        >
          {/* Animated Background Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shrink-0">
                {recentUnlockedBadge.icon}
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Achievement Unlocked!</span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {recentUnlockedBadge.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {recentUnlockedBadge.description}
                </p>
              </div>
            </div>

            <button
              onClick={clearRecentBadge}
              className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="capitalize text-amber-400 font-bold">
              {recentUnlockedBadge.tier} Tier Trophy
            </span>
            <div className="flex items-center gap-1 text-slate-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Added to your shelf</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
