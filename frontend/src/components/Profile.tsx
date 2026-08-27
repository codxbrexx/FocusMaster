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
      className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 pb-24 font-sans text-slate-900"
    >
      <BadgeUnlockToast />

      {/* Hero Cover & Profile Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        {/* Cover Banner */}
        <div className="h-36 bg-gradient-to-r from-[#6E36E4] via-indigo-600 to-purple-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl" />
        </div>

        {/* Profile Details */}
        <div className="px-6 pb-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-14 gap-5">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden shrink-0 relative z-20">
              <img
                src={user?.picture || '/profilelogo.png'}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {user?.name || 'Focus User'}
                </h1>
                {user?.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user?.email || 'No email provided'}</span>
                </div>
                <div className="hidden md:block w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Member since {new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="hidden md:block w-px h-3 bg-slate-200" />
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isGuest ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isGuest ? 'Guest Account' : 'Pro Member'}
                </span>
              </div>
            </div>

            {/* Edit Action Button */}
            <div className="pt-2 md:pt-0">
              <button
                onClick={() => navigate('/profile/edit')}
                className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Focus Hours"
          value={totalHours}
          subvalue="hrs"
          color="text-blue-600"
          bg="bg-blue-50 border-blue-100"
          trend="Top performance"
        />
        <StatCard
          icon={CheckCircle2}
          label="Sessions"
          value={totalSessions}
          subvalue="total"
          color="text-emerald-600"
          bg="bg-emerald-50 border-emerald-100"
          trend="Regular worker"
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={streak}
          subvalue="days"
          color="text-amber-600"
          bg="bg-amber-50 border-amber-100"
          trend="Active streak"
        />
        <StatCard
          icon={Trophy}
          label="Daily Avg"
          value={dailyAverage}
          subvalue="sess"
          color="text-purple-600"
          bg="bg-purple-50 border-purple-100"
          trend="Consistent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap & Recent Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <FocusHeatmap />

          {/* Recent Activity Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Recent Work Sessions
              </h3>
            </div>

            <div className="space-y-2">
              {sessions.slice(0, 5).map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        session.type === 'pomodoro'
                          ? 'bg-purple-50 text-[#6E36E4] border border-purple-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}
                    >
                      {session.type === 'pomodoro' ? (
                        <Flame className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 capitalize">
                        {session.type === 'pomodoro' ? 'Deep Focus Session' : session.type.replace('-', ' ')}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {format(new Date(session.startTime), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-xs font-bold font-mono text-slate-800">
                    {Math.floor(session.duration / 60)}m
                  </span>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <Clock className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">No sessions recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gamification Level & Streak Shield Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Gamification Rank
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {currentLevel.name}
                </h3>
                <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-bold">
                  LVL {xpSummary?.level || currentLevel.level}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6E36E4] rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold font-mono text-slate-500">
                <span className="text-[#6E36E4]">{userPoints.toLocaleString()} XP</span>
                {xpSummary?.nextLevelXPThreshold && (
                  <span>Next: {xpSummary.nextLevelXPThreshold.toLocaleString()} XP</span>
                )}
              </div>
            </div>

            {/* Streak Shield Control */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {streakShieldActive ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <span className="text-xs font-bold block text-slate-900">Streak Shield</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {streakShieldActive ? 'Active Protection' : 'Inactive'}
                  </span>
                </div>
              </div>

              {!streakShieldActive && (
                <button
                  onClick={activateShield}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <BadgeGrid />
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, subvalue, color, bg, trend }: any) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-xl border ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend && (
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold font-mono text-slate-900">{value}</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
          {label} · {subvalue}
        </div>
      </div>
    </div>
  );
}
