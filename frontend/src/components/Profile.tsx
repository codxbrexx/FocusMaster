import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useBadgeStore } from '@/store/useBadgeStore';
import { motion } from 'framer-motion';
import {
  Mail,
  Calendar,
  Trophy,
  Clock,
  Flame,
  Zap,
  CheckCircle2,
  MoreHorizontal,
  Edit3,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { FocusHeatmap } from './FocusHeatmap';
import { format } from 'date-fns';
import { getLevelInfo, getProgressPercent } from '@/utils/levelUtils';
import { BadgeGrid } from './badges/BadgeGrid';
import { BadgeUnlockToast } from './badges/BadgeUnlockToast';

export function Profile() {
  const { user } = useAuth();
  const { sessions } = useHistoryStore();
  const { xpSummary, fetchXpSummary, activateShield } = useBadgeStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchXpSummary();
  }, [fetchXpSummary]);

  // Stats Calculations
  const totalSessions = sessions.filter((s) => s.type === 'pomodoro').length;

  const totalMinutes =
    sessions.filter((s) => s.type === 'pomodoro').reduce((acc, s) => acc + s.duration, 0) / 60;

  const totalHours = (totalMinutes / 60).toFixed(1);

  const getDailyAverage = () => {
    if (sessions.length === 0) return 0;
    const uniqueDays = new Set(sessions.map((s) => new Date(s.startTime).toDateString())).size;
    return uniqueDays > 0 ? (totalSessions / uniqueDays).toFixed(1) : 0;
  };

  const streak = xpSummary?.currentStreak || 0;
  const dailyAverage = getDailyAverage();
  const isGuest = user?.isGuest || localStorage.getItem('isGuest') === 'true';
  const userPoints = xpSummary?.totalXP || user?.points || 0;

  const currentLevel = getLevelInfo(userPoints);
  const progressPercent = xpSummary?.progressPercent ?? getProgressPercent(userPoints);
  const streakShieldActive = xpSummary?.streakShield?.active || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-24"
    >
      <BadgeUnlockToast />

      <div className="relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm group">
        {/* Cover Image Area */}
        <div className="h-40 bg-gradient-to-r from-zinc-900 via-slate-900 to-indigo-950 relative overflow-hidden backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32 mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -ml-20 -mb-20 mix-blend-screen" />
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 gap-6">
            {/* Avatar */}
            <div className="relative group/avatar">
              <div className="w-36 h-36 rounded-2xl border-[6px] border-background bg-background shadow-xl overflow-hidden relative z-10 ring-1 ring-border/20">
                <img
                  src={user?.picture || '/profilelogo.png'}
                  alt={user?.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                />
              </div>
              <div className="absolute bottom-2 -right-2 z-20 bg-background p-1.5 rounded-full shadow-sm ring-1 ring-border/10">
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-500" />
              </div>
            </div>

            {/* Text Info */}
            <div className="flex-1 min-w-0 pb-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground/90 font-display">
                  {user?.name || 'Guest User'}
                </h1>
                {user?.role === 'admin' && (
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-3 text-sm text-muted-foreground/80 font-medium">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <div className="p-1 rounded bg-muted/50">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span>{user?.email || 'No email provided'}</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-border" />
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <div className="p-1 rounded bg-muted/50">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    Joined{' '}
                    {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {/* Badge */}
                <div className="hidden md:block w-px h-4 bg-border" />
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm ${isGuest ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}`}
                >
                  {isGuest ? 'Guest' : 'Pro Member'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pb-2 w-full md:w-auto justify-center md:justify-end">
              <button
                onClick={() => navigate('/profile/edit')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <div className="h-10 w-px bg-border/50 hidden md:block mx-2" />

              <button className="p-2.5 rounded-xl hover:bg-muted/80 transition-colors border border-transparent hover:border-border text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Focus Hours"
          value={totalHours}
          subvalue="hrs"
          color="text-blue-500"
          bg="bg-blue-500/10"
          trend="+12% vs last week"
        />
        <StatCard
          icon={CheckCircle2}
          label="Sessions"
          value={totalSessions}
          subvalue="total"
          color="text-emerald-500"
          bg="bg-emerald-500/10"
          trend="Top 5% of users"
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={streak}
          subvalue="days"
          color="text-orange-500"
          bg="bg-orange-500/10"
          trend="Keep it up!"
        />
        <StatCard
          icon={Trophy}
          label="Daily Avg"
          value={dailyAverage}
          subvalue="sess"
          color="text-purple-500"
          bg="bg-purple-500/10"
          trend="Consistent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Consistency Heatmap (Spans 2 columns) --- */}
        <div className="lg:col-span-2 space-y-6">
          <FocusHeatmap />

          {/* Recent Activity List */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Recent Activity
              </h3>
              <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                View History
              </button>
            </div>

            <div className="space-y-1">
              {sessions.slice(0, 5).map((session, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between p-3.5 hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent rounded-xl transition-all duration-300 border border-transparent hover:border-border/40"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${session.type === 'pomodoro' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}
                    >
                      {session.type === 'pomodoro' ? (
                        <Flame className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize truncate">
                        {session.type === 'pomodoro'
                          ? 'Deep Focus Session'
                          : session.type.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {format(new Date(session.startTime), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-secondary/50 text-xs font-medium text-secondary-foreground border border-border/30">
                      {Math.floor(session.duration / 60)}m
                    </span>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-12 opacity-50 border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                  <Clock className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">No recent sessions found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Gamification & Rank Sidebar --- */}
        <div className="space-y-6">
          {/* Rank & XP Card */}
          <div
            className={`border rounded-2xl p-6 shadow-sm relative overflow-hidden group transition-all duration-500 ${currentLevel.border} bg-card`}
          >
            <div
              className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none opacity-20 bg-gradient-to-br ${currentLevel.gradient}`}
            />

            <div className="relative z-10">
              <span
                className={`text-xs font-bold uppercase tracking-widest mb-2 block ${currentLevel.color}`}
              >
                Current Rank
              </span>
              <div className="flex items-end gap-3 mb-4">
                <h3 className="text-1xl md:text-2xl font-bold text-foreground tracking-tight">
                  {currentLevel.name}
                </h3>
                <div
                  className={`mb-1.5 text-[8px] md:text-[12px] px-2 py-0.5 rounded border font-bold uppercase ${currentLevel.bg} ${currentLevel.color} ${currentLevel.border}`}
                >
                  LVL {xpSummary?.level || currentLevel.level}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden mb-2 border border-border/50">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${currentLevel.gradient} shadow-lg shadow-current/20 transition-all duration-1000 ease-out`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mt-1">
                <span className={currentLevel.color}>{userPoints.toLocaleString()} XP</span>
                {xpSummary?.nextLevelXPThreshold && (
                  <span>Next: {xpSummary.nextLevelXPThreshold.toLocaleString()} XP</span>
                )}
              </div>

              {/* Streak Shield Control */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {streakShieldActive ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                  )}
                  <div>
                    <span className="text-xs font-bold block text-foreground">Streak Shield</span>
                    <span className="text-[10px] text-muted-foreground">
                      {streakShieldActive ? 'Active (Missed day protection)' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {!streakShieldActive && (
                  <button
                    onClick={activateShield}
                    className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Full-width Badge Grid Shelf --- */}
      <BadgeGrid />
    </motion.div>
  );
}

// --- Micro-Components ---

function StatCard({ icon: Icon, label, value, subvalue, color, bg, trend }: any) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend && (
          <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-full border border-emerald-500/10">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-foreground">{value}</h4>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <span className="text-[10px] text-muted-foreground/60">• {subvalue}</span>
        </div>
      </div>
    </div>
  );
}
