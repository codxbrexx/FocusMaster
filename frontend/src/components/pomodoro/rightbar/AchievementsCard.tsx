import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 px-5 pt-5">
        <CardTitle className="text-sm font-semibold text-foreground">Achievements</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-2">
          {achievements.map(({ icon, label, unlocked }) => (
            <div
              key={label}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                unlocked
                  ? 'bg-primary/10 border border-primary/20'
                  : 'opacity-40 bg-secondary/50'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className={`text-sm font-medium flex-1 ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {unlocked && (
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
