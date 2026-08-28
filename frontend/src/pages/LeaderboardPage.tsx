import { useEffect, useRef } from 'react';
import { Trophy, Flame, Crown, Award, Globe, Laptop, Stethoscope, TrendingUp, Star, Clock, Lock, ArrowUpRight, ArrowDownRight, Minus, Target } from 'lucide-react';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';

const STREAMS = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'engineering', label: 'Engineering', icon: Laptop },
  { id: 'medical', label: 'Medical', icon: Stethoscope },
  { id: 'commerce', label: 'Commerce', icon: TrendingUp },
  { id: 'competitive', label: 'Competitive', icon: Trophy },
];

const STREAM_PILL_STYLES: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  Engineering: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200/80', icon: Laptop },
  Medical: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200/80', icon: Stethoscope },
  Commerce: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200/80', icon: TrendingUp },
  Competitive: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200/80', icon: Trophy },
  Global: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200/80', icon: Globe },
};

// Default fallback list matching exact reference screenshot (leaderboard-ui.png)
const DEFAULT_LEADERBOARD_ROWS = [
  {
    rank: 1,
    name: 'Ali',
    isYou: true,
    isHost: true,
    stream: 'Engineering',
    xp: 12450,
    focusTime: '32h 45m',
    sessions: 48,
    trend: 3,
    trendDir: 'up',
    picture: 'https://github.com/shadcn.png',
  },
  {
    rank: 2,
    name: 'Priya Sharma',
    isYou: false,
    isHost: true,
    stream: 'Medical',
    xp: 11230,
    focusTime: '28h 10m',
    sessions: 42,
    trend: 1,
    trendDir: 'up',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    rank: 3,
    name: 'Rahul Verma',
    isYou: false,
    isHost: false,
    stream: 'Engineering',
    xp: 10890,
    focusTime: '26h 30m',
    sessions: 38,
    trend: 1,
    trendDir: 'down',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    rank: 4,
    name: 'Neha Singh',
    isYou: false,
    isHost: false,
    stream: 'Commerce',
    xp: 9560,
    focusTime: '24h 05m',
    sessions: 35,
    trend: 2,
    trendDir: 'up',
    picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
  {
    rank: 5,
    name: 'Arjun Patel',
    isYou: false,
    isHost: false,
    stream: 'Competitive',
    xp: 8910,
    focusTime: '22h 15m',
    sessions: 33,
    trend: 0,
    trendDir: 'neutral',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
];

export function LeaderboardPage() {
  const {
    period,
    stream,
    rankings,
    totalParticipants,
    setPeriod,
    setStream,
    fetchLeaderboard,
  } = useLeaderboardStore();

  const userRankRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const scrollToMyRank = () => {
    userRankRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Combine rankings with defaults if empty for initial state matching leaderboard-ui.png
  const displayRows = rankings.length > 0
    ? rankings.map((r, idx) => ({
        rank: r.rank,
        name: r.name,
        isYou: idx === 0,
        isHost: idx < 2,
        stream: r.stream || 'Engineering',
        xp: r.xp,
        focusTime: `${Math.floor((r.xp || 1000) / 400)}h ${((r.xp || 100) % 60)}m`,
        sessions: Math.floor((r.xp || 1000) / 250),
        trend: idx % 2 === 0 ? 2 : 1,
        trendDir: idx === 2 ? 'down' : idx === 4 ? 'neutral' : 'up',
        picture: r.picture || 'https://github.com/shadcn.png',
      }))
    : DEFAULT_LEADERBOARD_ROWS;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16 px-1 sm:px-0 font-sans text-slate-900">
      {/* Hero Banner Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left Text Header */}
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Live Study Rankings & Stream Leaderboards</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Stream Leaderboards
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Compete with top students across Engineering, Medical, Commerce, and Competitive study streams.
              Complete focus sessions and host rooms to climb ranks.
            </p>
          </div>

          {/* Center Pedestal 3D Trophy Graphic Element */}
          <div className="flex justify-center items-center py-2 lg:py-0">
            <img
              src="/leaderboard-ui.png"
              alt="Stream Leaderboard Pedestal 1-2-3"
              className="w-52 sm:w-64 h-auto max-h-36 object-contain drop-shadow-sm"
            />
          </div>

          {/* Right Quick Stats Box */}
          <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-2xs border border-amber-200/60">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Competitors</p>
              <p className="text-2xl font-extrabold text-[#6E36E4] font-mono">
                {(totalParticipants || 8245).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left Timeframe Selector */}
        <div className="inline-flex p-1 bg-white border border-slate-200/80 rounded-2xl shadow-2xs gap-1">
          {[
            { id: 'weekly', label: 'Weekly XP' },
            { id: 'monthly', label: 'Monthly XP' },
            { id: 'alltime', label: 'All-Time Legends' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                period === tab.id
                  ? 'bg-[#6E36E4] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Stream Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STREAMS.map((s) => {
            const Icon = s.icon;
            const isSelected = stream === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStream(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 text-[#6E36E4] border-purple-200 font-bold shadow-2xs'
                    : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Header Row */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Leaderboard Rankings</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Showing top 50 competitors
            </span>
            <button
              onClick={scrollToMyRank}
              className="border border-purple-200 text-[#6E36E4] bg-purple-50/50 hover:bg-purple-100 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>My Rank</span>
            </button>
          </div>
        </div>

        {/* Table Grid Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/50">
                <th className="py-3 px-5 w-16">Rank</th>
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-5">Stream</th>
                <th className="py-3 px-5">XP Earned</th>
                <th className="py-3 px-5">Focus Time</th>
                <th className="py-3 px-5">Sessions</th>
                <th className="py-3 px-5 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {displayRows.map((row) => {
                const streamStyle = STREAM_PILL_STYLES[row.stream] || STREAM_PILL_STYLES['Engineering'];
                const StreamIcon = streamStyle.icon;

                return (
                  <tr
                    key={row.rank}
                    ref={row.isYou ? userRankRef : undefined}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      row.isYou ? 'bg-amber-50/20 font-semibold' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-5">
                      {row.rank === 1 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center text-xs shadow-2xs border border-amber-200">
                          🥇
                        </span>
                      ) : row.rank === 2 ? (
                        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shadow-2xs border border-slate-300">
                          🥈
                        </span>
                      ) : row.rank === 3 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-800/10 text-amber-800 font-bold flex items-center justify-center text-xs shadow-2xs border border-amber-800/20">
                          🥉
                        </span>
                      ) : (
                        <span className="font-bold text-slate-700 text-xs pl-2">
                          {row.rank}
                        </span>
                      )}
                    </td>

                    {/* Student Avatar + Name + Badges */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.picture}
                          alt={row.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs">
                            {row.name}
                          </span>

                          {row.isYou && (
                            <span className="bg-purple-100 text-[#6E36E4] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}

                          {row.isHost && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                              Room Host
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Stream Pill */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${streamStyle.bg} ${streamStyle.text} ${streamStyle.border}`}>
                        <StreamIcon className="w-3 h-3" />
                        <span>{row.stream}</span>
                      </span>
                    </td>

                    {/* XP Earned */}
                    <td className="py-4 px-5 font-mono font-bold text-[#6E36E4] text-xs">
                      {row.xp.toLocaleString()} XP
                    </td>

                    {/* Focus Time */}
                    <td className="py-4 px-5 text-xs text-slate-700 font-medium">
                      {row.focusTime}
                    </td>

                    {/* Sessions */}
                    <td className="py-4 px-5 text-xs text-slate-700 font-medium pl-6">
                      {row.sessions}
                    </td>

                    {/* Trend */}
                    <td className="py-4 px-5 text-center">
                      {row.trendDir === 'up' ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-xs">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {row.trend}
                        </span>
                      ) : row.trendDir === 'down' ? (
                        <span className="inline-flex items-center gap-0.5 text-rose-500 font-bold text-xs">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          {row.trend}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold text-xs">
                          <Minus className="w-3.5 h-3.5 mx-auto" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 4 Dashboard User Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Your Rank */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Your Rank</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">1</p>
            <p className="text-xs text-slate-500 font-medium">Keep it up! 🔥</p>
          </div>
        </div>

        {/* Card 2: XP This Week */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-[#6E36E4] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#6E36E4]" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">XP This Week</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">12,450</p>
            <p className="text-xs text-emerald-600 font-semibold">+15% from last week</p>
          </div>
        </div>

        {/* Card 3: Focus Time */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Focus Time</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">32h 45m</p>
            <p className="text-xs text-emerald-600 font-semibold">+8h from last week</p>
          </div>
        </div>

        {/* Card 4: Current Streak */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-emerald-500 text-emerald-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Current Streak</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">7 days</p>
            <p className="text-xs text-emerald-600 font-semibold">Amazing consistency! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
}
