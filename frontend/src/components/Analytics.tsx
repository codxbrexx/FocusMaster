import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { AnalyticsStats } from './analytics/AnalyticsStats';
import { LoadingSpinner } from './ui/LoadingSpinner';

const FocusActivityChart = lazy(() =>
  import('./analytics/FocusActivityChart').then((m) => ({ default: m.FocusActivityChart }))
);
const WeeklyIntensityChart = lazy(() =>
  import('./analytics/WeeklyIntensityChart').then((m) => ({ default: m.WeeklyIntensityChart }))
);
const CategoryDistributionChart = lazy(() =>
  import('./analytics/CategoryDistributionChart').then((m) => ({
    default: m.CategoryDistributionChart,
  }))
);

export function Analytics() {
  const { sessions, clockEntries } = useHistoryStore();
  const { settings } = useSettingsStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'Week' | 'Month' | 'Year'>('Week');

  const today = new Date();
  const todayStr = today.toDateString();

  const todaySessions = sessions.filter((s) => new Date(s.startTime).toDateString() === todayStr);
  const todayPomodoros = todaySessions.filter((s) => s.type === 'pomodoro').length;

  const getLongestStreak = () => {
    const dates = [...new Set(sessions.map((s) => new Date(s.startTime).toDateString()))];
    let maxStreak = 0;
    let currentStreak = 0;

    const sortedDates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (sortedDates.length > 0) currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(maxStreak, currentStreak);
  };

  const getWeeklyHeatmap = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmapData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + index);
      const dateStr = date.toDateString();
      const count = sessions.filter(
        (s) => new Date(s.startTime).toDateString() === dateStr && s.type === 'pomodoro'
      ).length;
      return { day, count, fullDate: dateStr };
    });
    return heatmapData;
  };

  const getCategoryDistribution = () => {
    const categories = sessions
      .filter((s) => s.type === 'pomodoro' && s.tag)
      .reduce(
        (acc, s) => {
          acc[s.tag!] = (acc[s.tag!] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getFocusBreakData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 6 + i);
      return date.toDateString();
    });

    return last7Days.map((dateStr) => {
      const daySessions = sessions.filter((s) => new Date(s.startTime).toDateString() === dateStr);
      const focus = Math.floor(
        daySessions.filter((s) => s.type === 'pomodoro').reduce((acc, s) => acc + s.duration, 0) /
          60
      );
      const breaks = Math.floor(
        daySessions.filter((s) => s.type !== 'pomodoro').reduce((acc, s) => acc + s.duration, 0) /
          60
      );

      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      return { day: dayName, focus, break: breaks };
    });
  };

  const getTotalWorkHours = () => {
    const total = clockEntries.reduce((acc, entry) => {
      if (entry.clockOut) {
        const diff = new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime();
        return acc + diff;
      }
      return acc;
    }, 0);

    const hours = Math.floor(total / (1000 * 60 * 60));
    return hours;
  };

  const completionRate =
    settings.dailyGoal > 0 ? Math.round((todayPomodoros / settings.dailyGoal) * 100) : 0;

  const COLORS = ['#6E36E4', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  const heatmapData = getWeeklyHeatmap();
  const categoryData = getCategoryDistribution();
  const focusBreakData = getFocusBreakData();
  const totalWorkHours = getTotalWorkHours();
  const longestStreak = getLongestStreak();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-24 font-sans text-slate-900"
    >
      {/* Hero Banner Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-semibold">
            <BarChart2 className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>Productivity Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics & Performance Insights
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xl">
            Track daily goal completion, focus time volume, streaks, and activity category distribution.
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 flex items-center gap-1">
          {(['Week', 'Month', 'Year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-white text-[#6E36E4] shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <AnalyticsStats
        todayPomodoros={todayPomodoros}
        dailyGoal={settings.dailyGoal}
        completionRate={completionRate}
        longestStreak={longestStreak}
        totalWorkHours={totalWorkHours}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense
          fallback={
            <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <LoadingSpinner />
            </div>
          }
        >
          <FocusActivityChart data={focusBreakData} />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <LoadingSpinner />
            </div>
          }
        >
          <WeeklyIntensityChart data={heatmapData} />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <LoadingSpinner />
            </div>
          }
        >
          <CategoryDistributionChart data={categoryData} colors={COLORS} />
        </Suspense>
      </div>
    </motion.div>
  );
}
