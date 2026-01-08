import { useMemo } from 'react';
import { FocusHeatmap } from './FocusHeatmap';
import {
  Trophy,
  Target,
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useTaskStore } from '@/store/useTaskStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useAuth } from '../context/AuthContext';
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { StatsOverview } from './dashboard/StatsOverview';
import { PriorityTasks } from './dashboard/PriorityTasks';
import { DailyOverviewChart } from './dashboard/DailyOverviewChart';

const MOTIVATIONAL_QUOTES = [
  'Focus is the gateway to thinking, learning, and memory.',
  'Success is the sum of small efforts repeated day in and day out.',
  'The secret of getting ahead is getting started.',
  "Don't watch the clock; do what it does. Keep going.",
  "You don't have to be great to start, but you have to start to be great.",
  "Your focus determines your reality.",
];

export function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTaskStore();
  const { settings } = useSettingsStore();
  const { sessions } = useHistoryStore();

  const points = useMemo(() => {
    const sessionPoints = sessions.filter((s) => s.type === 'pomodoro').length * 25;
    const taskPoints = tasks.filter((t) => t.isCompleted).length * 10;
    return sessionPoints + taskPoints;
  }, [sessions, tasks]);

  const today = new Date().toDateString();

  const todaySessions = useMemo(() => sessions.filter((s) => new Date(s.startTime).toDateString() === today), [sessions, today]);

  const todayPomodoros = useMemo(() => todaySessions.filter((s) => s.type === 'pomodoro').length, [todaySessions]);

  const todayMinutes = useMemo(() => Math.floor(
    todaySessions
      .filter((s) => s.type === 'pomodoro')
      .reduce((acc, s) => acc + s.duration, 0) / 60
  ), [todaySessions]);

  const todayTasks = useMemo(() => tasks.filter((t) => !t.isCompleted), [tasks]);

  const completedToday = useMemo(() => tasks.filter(
    (t) => t.isCompleted && new Date(t.createdAt).toDateString() === today
  ).length, [tasks, today]);

  const progressPercentage = useMemo(() =>
    settings.dailyGoal > 0 ? Math.min((todayPomodoros / settings.dailyGoal) * 100, 100) : 0
    , [todayPomodoros, settings.dailyGoal]);

  const badge = useMemo(() => {
    if (points >= 800)
      return {
        name: 'Gold Master',
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: Trophy,
      };
    if (points >= 300)
      return {
        name: 'Silver Achiever',
        color: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
        icon: Trophy,
      };
    if (points >= 100)
      return {
        name: 'Bronze Starter',
        color: 'bg-amber-600/10 text-amber-600 border-amber-600/20',
        icon: Trophy,
      };
    return {
      name: 'Beginner',
      color: 'bg-primary/10 text-primary border-primary/20',
      icon: Target,
    };
  }, [points]);

  const randomQuoteIndex = useMemo(
    () => (user?.name?.length ?? 0) % MOTIVATIONAL_QUOTES.length,
    [user?.name]
  );
  const randomQuote = MOTIVATIONAL_QUOTES[randomQuoteIndex];

  const yesterday = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toDateString();
  }, []);

  const currentStreak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const dates = [...new Set(sessions.map((s) => new Date(s.startTime).toDateString()))];
    const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const lastFocus = sortedDates[0];
    if (lastFocus !== today && lastFocus !== yesterday) {
      return 0;
    }

    // Simple consecutive logic could be improved, but this matches original intent
    return sortedDates.length > 0 ? 1 : 0;
  }, [sessions, today, yesterday]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const averageFocusDuration = useMemo(() => sessions.length
    ? Math.round(todayMinutes / Math.max(todaySessions.length, 1))
    : 0, [sessions.length, todayMinutes, todaySessions.length]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-8 pb-10"
    >
      <WelcomeHeader
        user={user}
        settings={settings}
        randomQuote={randomQuote}
        points={points}
        badge={badge}
      />

      <StatsOverview
        todayPomodoros={todayPomodoros}
        todayMinutes={todayMinutes}
        dailyGoal={settings.dailyGoal}
        pomodoroDuration={settings.pomodoroDuration}
        currentStreak={currentStreak}
        completedToday={completedToday}
        totalTasks={tasks.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PriorityTasks tasks={todayTasks} />

        <DailyOverviewChart
          progressPercentage={progressPercentage}
          todayPomodoros={todayPomodoros}
          dailyGoal={settings.dailyGoal}
          todayMinutes={todayMinutes}
          sessionCount={sessions.length}
          averageFocusDuration={averageFocusDuration}
        />

        <div className="block lg:col-span-3">
          <FocusHeatmap />
        </div>
      </div>
    </motion.div>
  );
}
