import { motion } from 'framer-motion';
import { Target, Zap, Activity } from 'lucide-react';

interface AnalyticsStatsProps {
  todayPomodoros: number;
  dailyGoal: number;
  completionRate: number;
  longestStreak: number;
  totalWorkHours: number;
}

export function AnalyticsStats({
  todayPomodoros,
  dailyGoal,
  completionRate,
  longestStreak,
  totalWorkHours,
}: AnalyticsStatsProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-slate-900">
      {/* Sessions Today & Goal */}
      <motion.div variants={item}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4 hover:border-purple-200 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-purple-50 text-[#6E36E4] rounded-xl border border-purple-100">
              <Target className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                completionRate >= 100
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-purple-50 text-[#6E36E4] border-purple-100'
              }`}
            >
              {completionRate}% Goal
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-slate-900">
              {todayPomodoros}
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between mt-1">
              <span>Sessions Today</span>
              <span className="font-bold text-slate-700">Goal: {dailyGoal}</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6E36E4] transition-all duration-1000"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Day Streak */}
      <motion.div variants={item}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4 hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Best Streak
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-slate-900">{longestStreak} <span className="text-sm font-sans font-medium text-slate-500">Days</span></div>
            <div className="text-xs text-slate-500 font-medium mt-1">Consecutive Activity</div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${Math.min((longestStreak / 30) * 100, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Total Work Hours */}
      <motion.div variants={item}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4 hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Logged Time
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-slate-900">
              {totalWorkHours}<span className="text-sm font-sans font-medium text-slate-500">h</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Total Work Hours</div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
