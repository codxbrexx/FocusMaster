const Session = require("../../models/Session");
const Task = require("../../models/Task");
const {
  subDays,
  format,
  getHours,
  differenceInCalendarDays,
} = require("date-fns");

/**
 * Aggregate productivity statistics for a user.
 *
 * Returns pre-computed metrics that downstream services (insight engine,
 * recommender, productivity score) consume.  This function is the single
 * source of truth for user analytics — AI services never query the
 * database directly.
 *
 * @param {string} userId
 * @param {number} [days=30]
 * @returns {Promise<Object>} 
 */
async function aggregateUserStats(userId, days = 30) {
  const since = subDays(new Date(), days);

  // Fetch raw data
  const [sessions, tasks] = await Promise.all([
    Session.find({ user: userId, startTime: { $gte: since } }).lean(),
    Task.find({ user: userId }).lean(),
  ]);

  const focusSessions = sessions.filter((s) => s.type === "focus");
  const breakSessions = sessions.filter((s) => s.type !== "focus");

  // Basic counters
  const totalFocusSessions = focusSessions.length;
  const totalFocusSeconds = focusSessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0,
  );
  const avgFocusDurationMin =
    totalFocusSessions > 0
      ? Math.round(totalFocusSeconds / totalFocusSessions / 60)
      : 0;

  // Completion rate
  const completedFocus = focusSessions.filter((s) => s.completed).length;
  const completionRate =
    totalFocusSessions > 0
      ? Math.round((completedFocus / totalFocusSessions) * 100)
      : 0;

  // Peak productive hours (hour-of-day histogram, top 3)
  const hourCounts = new Array(24).fill(0);
  focusSessions.forEach((s) => {
    if (s.startTime) {
      hourCounts[getHours(new Date(s.startTime))] += 1;
    }
  });
  const peakHours = hourCounts
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .filter((h) => h.count > 0)
    .slice(0, 3)
    .map((h) => h.hour);

  // Break frequency
  const breakFrequency =
    totalFocusSessions > 0
      ? Math.round((breakSessions.length / totalFocusSessions) * 100) / 100
      : 0;

  // Current streak (consecutive days with ≥1 focus session)
  const focusDates = [
    ...new Set(
      focusSessions
        .filter((s) => s.startTime)
        .map((s) => format(new Date(s.startTime), "yyyy-MM-dd")),
    ),
  ].sort();

  let currentStreak = 0;
  if (focusDates.length > 0) {
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    const lastDate = focusDates[focusDates.length - 1];

    if (lastDate === today || lastDate === yesterday) {
      currentStreak = 1;
      for (let i = focusDates.length - 2; i >= 0; i--) {
        const diff = differenceInCalendarDays(
          new Date(focusDates[i + 1]),
          new Date(focusDates[i]),
        );
        if (diff === 1) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  // Weekly / monthly totals
  const weekAgo = subDays(new Date(), 7);
  const thisWeekSessions = focusSessions.filter(
    (s) => s.startTime && new Date(s.startTime) >= weekAgo,
  );
  const weeklyFocusMin = Math.round(
    thisWeekSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60,
  );
  const monthlyFocusMin = Math.round(totalFocusSeconds / 60);

  // Task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mood distribution
  const moodCounts = {};
  focusSessions.forEach((s) => {
    if (s.mood) {
      moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
    }
  });

  return {
    period: { days, since: since.toISOString() },
    focus: {
      totalSessions: totalFocusSessions,
      totalMinutes: monthlyFocusMin,
      avgDurationMin: avgFocusDurationMin,
      completionRate,
      weeklyMinutes: weeklyFocusMin,
    },
    patterns: {
      peakHours,
      breakFrequency,
      currentStreak,
      moodDistribution: moodCounts,
    },
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      completionRate: taskCompletionRate,
    },
    _meta: {
      generatedAt: new Date().toISOString(),
      sessionCount: sessions.length,
    },
  };
}

module.exports = { aggregateUserStats };
