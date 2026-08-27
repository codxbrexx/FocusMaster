import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { Trophy } from 'lucide-react';

interface Achievement {
  icon: string;
  label: string;
  unlocked: boolean;
}

export const AchievementsCard = () => {
  const { sessions } = useHistoryStore();

  const achievements: Achievement[] = useMemo(() => {
    const focusSessions = sessions.filter((s) => s.type === 'pomodoro');
    const totalFocusMin = focusSessions.reduce((acc, s) => acc + s.duration, 0);

    const focusDays = new Set<string>();
    focusSessions.forEach((s) => focusDays.add(new Date(s.startTime).toLocaleDateString('en-CA')));

    let streak = 0;
    if (focusDays.size > 0) {
      const today = new Date();
      const cursor = new Date(today);
      while (true) {
        if (focusDays.has(cursor.toLocaleDateString('en-CA'))) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        } else break;
      }
    }

    return [
      { icon: '🏆', label: `${streak} Day Streak`, unlocked: streak >= 3 },
      { icon: '⭐', label: `${focusSessions.length} Sessions`, unlocked: focusSessions.length >= 10 },
      { icon: '📚', label: `${Math.floor(totalFocusMin / 60)}h Focus`, unlocked: totalFocusMin >= 120 },
      { icon: '🎯', label: 'Goal Crusher', unlocked: focusSessions.length >= 50 },
      { icon: '🔥', label: '7-Day Streak', unlocked: streak >= 7 },
      { icon: '💎', label: '100 Sessions', unlocked: focusSessions.length >= 100 },
    ];
  }, [sessions]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          Key Milestones
        </h3>
        <span className="text-xs font-semibold text-slate-400">Unlocked</span>
      </div>

      <div className="space-y-2">
        {achievements.map(({ icon, label, unlocked }) => (
          <div
            key={label}
            className={`flex items-center gap-2.5 p-2 rounded-xl transition-all border ${
              unlocked
                ? 'bg-purple-50/60 border-purple-100 text-slate-900'
                : 'bg-slate-50/60 border-slate-100 text-slate-400 opacity-60'
            }`}
          >
            <span className="text-base">{icon}</span>
            <span className="text-xs font-bold flex-1">{label}</span>
            {unlocked && (
              <span className="text-[9px] font-bold text-[#6E36E4] bg-white border border-purple-200 px-2 py-0.5 rounded-full shadow-2xs">
                Unlocked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
