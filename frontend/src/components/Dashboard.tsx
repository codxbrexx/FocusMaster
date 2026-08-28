import { useEffect, useMemo } from 'react';
import { FocusHeatmap } from './FocusHeatmap';
import { motion, type Variants } from 'framer-motion';
import { useTaskStore } from '@/store/useTaskStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useAuth } from '../context/AuthContext';
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { StatsOverview } from './dashboard/StatsOverview';
import { PriorityTasks } from './dashboard/PriorityTasks';
import { DailyOverviewChart } from './dashboard/DailyOverviewChart';
import { WeeklyDigestCard } from './dashboard/WeeklyDigestCard';
import { useAiStore } from '@/store/useAiStore';

const MOTIVATIONAL_QUOTES = [
  'Focus is the gateway to thinking, learning, and memory.',
  'Success is the sum of small efforts repeated day in and day out.',
  'The secret of getting ahead is getting started.',
  "Don't watch the clock; do what it does. Keep going.",
  "You don't have to be great to start, but you have to start to be great.",
  'Your focus determines your reality.',
];

export function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTaskStore();
  const { settings } = useSettingsStore();
  const { sessions } = useHistoryStore();
  const { fetchStudyProfile: loadProfile } = useAiStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const points = useMemo(() => {
    const sessionPoints = sessions.filter((s) => s.type === 'pomodoro').length * 25;
    const taskPoints = tasks.filter((t) => t.isCompleted).length * 10;
    return sessionPoints + taskPoints;
  }, [sessions, tasks]);

  const today = new Date().toDateString();

  const todaySessions = useMemo(
    () => sessions.filter((s) => new Date(s.startTime).toDateString() === today),
    [sessions, today]
  );

  const todayPomodoros = useMemo(
    () => todaySessions.filter((s) => s.type === 'pomodoro').length,
    [todaySessions]
  );

  const todayMinutes = useMemo(
    () =>
      Math.floor(
        todaySessions.filter((s) => s.type === 'pomodoro').reduce((acc, s) => acc + s.duration, 0) /
          60
      ),
    [todaySessions]
  );

  const todayTasks = useMemo(() => tasks.filter((t) => !t.isCompleted), [tasks]);

  const completedToday = useMemo(
    () =>
      tasks.filter((t) => t.isCompleted && new Date(t.createdAt).toDateString() === today).length,
    [tasks, today]
  );

  const progressPercentage = useMemo(
    () => (settings.dailyGoal > 0 ? Math.min((todayPomodoros / settings.dailyGoal) * 100, 100) : 0),
    [todayPomodoros, settings.dailyGoal]
  );

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

  const averageFocusDuration = useMemo(
    () => (sessions.length ? Math.round(todayMinutes / Math.max(todaySessions.length, 1)) : 0),
    [sessions.length, todayMinutes, todaySessions.length]
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10 px-0.5 sm:px-0"
    >
      <WelcomeHeader user={user} settings={settings} randomQuote={randomQuote} points={points} />

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

        {/* Live Focus Rooms & Co-Working CTA Banner */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Co-Working Active</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Synchronized Focus Rooms & Leaderboards
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-xl">
              Study together in real-time with students across Engineering, Medical, Commerce and Competitive streams.
              Earn +15 XP bonus on every room session!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/rooms"
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-2xs transition-colors"
            >
              Browse Focus Rooms
            </a>
            <a
              href="/leaderboard"
              className="bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
            >
              View Leaderboards
            </a>
          </div>
        </div>

        <div className="block lg:col-span-3">
          <WeeklyDigestCard />
        </div>

        <div className="block lg:col-span-3">
          <FocusHeatmap />
        </div>
      </div>
    </motion.div>
  );
}
