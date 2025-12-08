import { motion } from 'framer-motion';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { AnalyticsStats } from './analytics/AnalyticsStats';
import { FocusActivityChart } from './analytics/FocusActivityChart';
import { WeeklyIntensityChart } from './analytics/WeeklyIntensityChart';
import { CategoryDistributionChart } from './analytics/CategoryDistributionChart';

export function Analytics() {
  const { sessions, clockEntries } = useHistoryStore();
  const { settings } = useSettingsStore();

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
      const focus = daySessions
        .filter((s) => s.type === 'pomodoro')
        .reduce((acc, s) => acc + s.duration, 0);
      const breaks = daySessions
        .filter((s) => s.type !== 'pomodoro')
        .reduce((acc, s) => acc + s.duration, 0);

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

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

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
      className="max-w-7xl mx-auto space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Gain insights into your productivity patterns.</p>
        </div>
        <div className="flex items-center gap-2 bg-accent/50 p-1 rounded-lg">
          {['Week', 'Month', 'Year'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${period === 'Week' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
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
        <FocusActivityChart data={focusBreakData} />
        <WeeklyIntensityChart data={heatmapData} />
        <CategoryDistributionChart data={categoryData} colors={COLORS} />
      </div>
    </motion.div>
  );
}
