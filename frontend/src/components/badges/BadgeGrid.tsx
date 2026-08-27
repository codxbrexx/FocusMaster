import { useEffect, useState } from 'react';
import { Award, Lock, ShieldCheck, Zap, Trophy, Flame, Crown, Star, Target, Compass, Sparkles, Moon, Sun, Activity, Medal } from 'lucide-react';
import { useBadgeStore, type Badge } from '@/store/useBadgeStore';

const BADGE_ICONS: Record<string, any> = {
  first_focus: Target,
  streak_7: Flame,
  streak_30: Sparkles,
  room_social: Compass,
  room_host: Crown,
  xp_1000: Zap,
  xp_10000: Trophy,
  leaderboard_top3: Medal,
  night_owl: Moon,
  early_bird: Sun,
  marathon: Activity,
  centurion: Star,
};

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
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200/80',
      border: 'border-amber-200',
      text: 'Bronze',
    },
    silver: {
      badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      border: 'border-slate-200',
      text: 'Silver',
    },
    gold: {
      badgeBg: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      border: 'border-yellow-200',
      text: 'Gold',
    },
    platinum: {
      badgeBg: 'bg-purple-50 text-[#6E36E4] border border-purple-200',
      border: 'border-purple-200',
      text: 'Platinum',
    },
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-2xs font-sans text-slate-900">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Badge & Achievements Shelf
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Unlock trophies by reaching focus milestones, maintaining streaks, and hosting focus rooms.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl shrink-0">
          <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span className="text-xs font-bold text-amber-800">
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              selectedTier === tier
                ? 'bg-[#6E36E4] text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
            <div key={i} className="h-32 bg-slate-100/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBadges.map((badge: Badge) => {
            const style = tierStyles[badge.tier] || tierStyles.bronze;
            const IconComponent = BADGE_ICONS[badge.id] || Trophy;

            return (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all ${
                  badge.unlocked
                    ? 'border-slate-200/80 bg-white shadow-2xs hover:border-[#6E36E4]/40'
                    : 'border-slate-100 bg-slate-50/50 opacity-60'
                }`}
              >
                {/* Tier Badge Pill */}
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${style.badgeBg}`}
                >
                  {style.text}
                </span>

                {/* Lucide Badge Icon */}
                <div className="relative my-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                      badge.unlocked
                        ? 'bg-purple-50 text-[#6E36E4] border border-purple-100 shadow-2xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {!badge.unlocked && (
                    <div className="absolute -bottom-1 -right-1 bg-slate-800 text-white rounded-full p-1 shadow-2xs">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1 mt-1 w-full">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1">
                    <span>{badge.name}</span>
                    {badge.unlocked && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" />}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>

                  {badge.unlocked && badge.earnedAt && (
                    <span className="inline-block text-[10px] text-slate-400 font-mono pt-1">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
