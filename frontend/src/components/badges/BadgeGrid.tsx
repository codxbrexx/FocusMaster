import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, ShieldCheck, Zap } from 'lucide-react';
import { useBadgeStore, type Badge } from '@/store/useBadgeStore';

export function BadgeGrid() {
  const { badges, fetchBadges, isLoading } = useBadgeStore();
  const [selectedTier, setSelectedTier] = useState<string>('all');

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const filteredBadges = selectedTier === 'all'
    ? badges
    : badges.filter((b) => b.tier === selectedTier);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const tierStyles: Record<string, { badgeBg: string; border: string; text: string }> = {
    bronze: {
      badgeBg: 'bg-amber-900/10 text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30',
      text: 'Bronze',
    },
    silver: {
      badgeBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
      border: 'border-slate-400/40',
      text: 'Silver',
    },
    gold: {
      badgeBg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-500/50',
      text: 'Gold',
    },
    platinum: {
      badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/50',
      text: 'Platinum',
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Badge & Achievements Shelf
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unlock trophies by reaching focus milestones, maintaining streaks, and hosting focus rooms.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
          <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
            {unlockedCount} of {badges.length} Unlocked
          </span>
        </div>
      </div>

      {/* Tier Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'bronze', 'silver', 'gold', 'platinum'].map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              selectedTier === tier
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tier === 'all' ? 'All Tiers' : tier}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBadges.map((badge: Badge) => {
            const style = tierStyles[badge.tier] || tierStyles.bronze;
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`relative flex flex-col items-center justify-between p-4 rounded-xl border text-center transition-all ${
                  badge.unlocked
                    ? `${style.border} bg-slate-50/50 dark:bg-slate-800/30 shadow-sm`
                    : 'border-slate-200 dark:border-slate-800/60 bg-slate-100/40 dark:bg-slate-900/40 opacity-60'
                }`}
              >
                {/* Tier Badge Pill */}
                <span
                  className={`absolute top-2 right-2 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${style.badgeBg}`}
                >
                  {style.text}
                </span>

                {/* Icon */}
                <div className="relative my-2">
                  <div
                    className={`text-4xl transition-transform ${
                      badge.unlocked ? 'filter drop-shadow-md scale-110' : 'grayscale opacity-50'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-slate-500 bg-slate-900/80 rounded-full p-1 shadow" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1 mt-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1">
                    {badge.name}
                    {badge.unlocked && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" />}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                    {badge.description}
                  </p>

                  {badge.unlocked && badge.earnedAt && (
                    <span className="inline-block text-[9px] text-slate-400 dark:text-slate-500 font-mono pt-1">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
