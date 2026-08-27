import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Crown, Award, Zap, Layers, Sparkles, UserCheck, Globe, Laptop, Stethoscope, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';

const STREAMS = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'engineering', label: 'Engineering', icon: Laptop },
  { id: 'medical', label: 'Medical', icon: Stethoscope },
  { id: 'commerce', label: 'Commerce', icon: TrendingUp },
  { id: 'competitive', label: 'Competitive', icon: Trophy },
];

export function LeaderboardPage() {
  const {
    period,
    stream,
    rankings,
    userRank,
    totalParticipants,
    isLoading,
    setPeriod,
    setStream,
    fetchLeaderboard,
  } = useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const top3 = rankings.slice(0, 3);
  const remainingRankings = rankings.slice(3);

  // Reorder top 3 for podium display: 2nd place (left), 1st place (center), 3rd place (right)
  const podiumOrder = [
    top3[1] || null, // 2nd
    top3[0] || null, // 1st
    top3[2] || null, // 3rd
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10 px-0.5 sm:px-0 font-sans text-foreground">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 sm:p-8 lg:p-10 shadow-sm space-y-4">
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-purple-500 to-cyan-500" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              <span>Live Study Rankings & Stream Leaderboards</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-foreground">
              Stream Leaderboards
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Compete with top students across Engineering, Medical, Commerce, and Competitive study streams. Complete focus sessions and host rooms to climb ranks.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-muted/40 border border-border/50 p-4 rounded-2xl shrink-0">
            <div className="p-2.5 rounded-xl bg-card text-foreground shadow-2xs border border-border/50">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active Competitors</p>
              <p className="text-lg font-bold text-foreground font-mono">
                {totalParticipants.toLocaleString()} Students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Period Selector Tabs */}
        <div className="inline-flex p-1.5 bg-card border border-border/50 rounded-2xl shadow-2xs gap-1">
          {[
            { id: 'weekly', label: 'Weekly XP' },
            { id: 'monthly', label: 'Monthly XP' },
            { id: 'alltime', label: 'All-Time Legends' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                period === tab.id
                  ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stream Selector Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STREAMS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setStream(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  stream === s.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-2xs font-semibold'
                    : 'bg-card border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logged In User Rank Banner */}
      {userRank && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-5 rounded-2xl shadow-md border-0 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg text-amber-400 font-mono ring-2 ring-amber-400/30">
                #{userRank.rank}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase font-semibold tracking-wider text-amber-300">
                    Your Current Standings
                  </span>
                </div>
                <p className="text-base font-medium text-white">
                  Ranked <span className="font-bold text-amber-400">#{userRank.rank}</span> of {totalParticipants} students in{' '}
                  <span className="capitalize font-semibold">{stream}</span> stream
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-6 relative z-10">
              <div className="text-center sm:text-left">
                <p className="text-[11px] text-slate-300 font-medium">Earned {period}</p>
                <p className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {userRank.xp.toLocaleString()} XP
                </p>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-[11px] text-slate-300 font-medium">Level</p>
                <Badge className="bg-white/20 text-white border-0 text-xs font-bold font-mono">
                  Lvl {userRank.level}
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Top 3 Podium Cards */}
      {!isLoading && top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-2">
          {podiumOrder.map((entry, idx) => {
            if (!entry) return null;
            const isFirst = entry.rank === 1;
            const isSecond = entry.rank === 2;

            return (
              <motion.div
                key={entry.userId}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className={`order-${idx + 1} ${isFirst ? 'md:-translate-y-4' : ''}`}
              >
                <Card
                  className={`bg-card border rounded-3xl p-6 text-center shadow-sm relative overflow-hidden flex flex-col items-center space-y-4 ${
                    isFirst
                      ? 'border-amber-400/80 shadow-md ring-2 ring-amber-400/20'
                      : isSecond
                      ? 'border-slate-300 dark:border-slate-700'
                      : 'border-amber-700/30'
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-500" />

                  {/* Rank Crown/Badge */}
                  <div className="relative">
                    <img
                      src={entry.picture}
                      alt={entry.name}
                      className={`rounded-full object-cover border-4 shadow-sm ${
                        isFirst ? 'w-20 h-20 border-amber-400' : 'w-16 h-16 border-border'
                      }`}
                    />
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 p-1.5 rounded-full shadow-md ${
                        isFirst
                          ? 'bg-amber-500 text-white'
                          : isSecond
                          ? 'bg-slate-400 text-white'
                          : 'bg-amber-700 text-white'
                      }`}
                    >
                      {isFirst ? (
                        <Crown className="w-4 h-4 fill-white" />
                      ) : (
                        <span className="font-mono text-xs font-bold px-1">#{entry.rank}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base truncate max-w-[180px]">
                      {entry.name}
                    </h3>
                    <Badge className="bg-muted text-foreground border border-border/50 text-[10px] uppercase font-medium">
                      {entry.stream}
                    </Badge>
                  </div>

                  <div className="w-full pt-3 border-t border-border/50 flex items-center justify-around text-xs text-muted-foreground">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">XP</p>
                      <p className="font-bold text-foreground font-mono text-sm">{entry.xp.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Level</p>
                      <p className="font-bold text-foreground font-mono text-sm">Lvl {entry.level}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Streak</p>
                      <p className="font-bold text-orange-500 font-mono text-sm flex items-center gap-0.5">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        {entry.streak}d
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Remaining Rankings Table */}
      <Card className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span>Leaderboard Rankings</span>
          </h2>
          <span className="text-xs text-muted-foreground font-medium">Showing top 50 competitors</span>
        </div>

        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-muted-foreground">Loading leaderboard rankings...</p>
          </div>
        ) : remainingRankings.length === 0 && top3.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground space-y-2">
            <Sparkles className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold text-foreground">No leaderboard rankings found</p>
            <p className="text-xs">Be the first student to earn XP in this stream!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40 overflow-x-auto">
            {remainingRankings.map((r) => {
              const isCurrentUser = userRank?.userId === r.userId;

              return (
                <div
                  key={r.userId}
                  className={`flex items-center justify-between p-4 px-6 hover:bg-muted/40 transition-colors ${
                    isCurrentUser ? 'bg-amber-500/10 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Number */}
                    <span className="font-mono text-sm font-bold text-muted-foreground w-8 text-center">
                      #{r.rank}
                    </span>

                    {/* Avatar & Name */}
                    <img
                      src={r.picture}
                      alt={r.name}
                      className="w-10 h-10 rounded-full object-cover border border-border/50"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{r.name}</span>
                        {isCurrentUser && (
                          <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[10px]">You</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground capitalize font-medium">{r.stream}</span>
                    </div>
                  </div>

                  {/* Level, XP & Streak Info */}
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Level</span>
                      <span className="font-bold text-foreground font-mono">Lvl {r.level}</span>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Streak</span>
                      <span className="font-bold text-orange-500 font-mono flex items-center gap-0.5 justify-end">
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                        {r.streak}d
                      </span>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">XP</span>
                      <span className="font-bold text-foreground font-mono text-sm">
                        {r.xp.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
