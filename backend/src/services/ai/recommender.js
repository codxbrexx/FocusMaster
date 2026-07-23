/**
 * Rule-Based Recommender
 *
 * Generates 2–3 actionable nudges per day from aggregated stats.
 * No LLM call needed — pure threshold/rule logic.
 *
 * Each rule checks a condition and returns a recommendation object
 * with { type, message, priority }.
 */

const RULES = [
  // ── Focus Duration ────────────────────────────────────────────
  {
    id: "shorter-sessions",
    check: (stats) =>
      stats.focus.completionRate < 70 && stats.focus.avgDurationMin > 35,
    result: () => ({
      type: "focus",
      message:
        "Your completion rate drops with longer sessions — try 25–30 minute Pomodoros instead.",
      priority: "high",
    }),
  },
  {
    id: "longer-sessions",
    check: (stats) =>
      stats.focus.completionRate > 90 && stats.focus.avgDurationMin < 30,
    result: (stats) => ({
      type: "focus",
      message: `You complete ${stats.focus.completionRate}% of sessions — you might handle 35–40 minute sessions well.`,
      priority: "medium",
    }),
  },

  // ── Consistency ───────────────────────────────────────────────
  {
    id: "streak-at-risk",
    check: (stats) =>
      stats.patterns.currentStreak > 0 && stats.patterns.currentStreak <= 2,
    result: (stats) => ({
      type: "streak",
      message: `Your ${stats.patterns.currentStreak}-day streak is just getting started — keep it alive today!`,
      priority: "high",
    }),
  },
  {
    id: "streak-momentum",
    check: (stats) => stats.patterns.currentStreak >= 7,
    result: (stats) => ({
      type: "streak",
      message: `${stats.patterns.currentStreak}-day streak! You've built solid momentum — don't break the chain.`,
      priority: "low",
    }),
  },
  {
    id: "no-streak",
    check: (stats) =>
      stats.patterns.currentStreak === 0 && stats.focus.totalSessions > 0,
    result: () => ({
      type: "streak",
      message:
        "Start a new streak today — even one short session counts!",
      priority: "medium",
    }),
  },

  // ── Peak Hours ────────────────────────────────────────────────
  {
    id: "peak-hours-reminder",
    check: (stats) => {
      const peaks = stats.patterns.peakHours || [];
      if (peaks.length === 0) return false;
      const currentHour = new Date().getHours();
      // Suggest if any peak hour is within the next 2 hours
      return peaks.some((h) => h >= currentHour && h <= currentHour + 2);
    },
    result: (stats) => {
      const peakFormatted = (stats.patterns.peakHours || [])
        .map((h) => {
          const h12 = h % 12 || 12;
          return `${h12} ${h < 12 ? "AM" : "PM"}`;
        })
        .join(", ");
      return {
        type: "timing",
        message: `Your peak focus time is coming up (${peakFormatted}) — schedule a session now.`,
        priority: "high",
      };
    },
  },

  // ── Break Frequency ───────────────────────────────────────────
  {
    id: "too-few-breaks",
    check: (stats) =>
      stats.patterns.breakFrequency < 0.5 && stats.focus.totalSessions >= 5,
    result: () => ({
      type: "wellness",
      message:
        "You're not taking enough breaks — regular breaks boost long-term focus.",
      priority: "medium",
    }),
  },

  // ── Task Completion ───────────────────────────────────────────
  {
    id: "low-task-completion",
    check: (stats) =>
      stats.tasks.total > 3 && stats.tasks.completionRate < 50,
    result: () => ({
      type: "tasks",
      message:
        "Less than half your tasks are done — break large tasks into smaller, completable pieces.",
      priority: "medium",
    }),
  },

  // ── Weekly Volume ─────────────────────────────────────────────
  {
    id: "low-weekly-volume",
    check: (stats) =>
      stats.focus.weeklyMinutes < 60 && stats.focus.totalSessions > 0,
    result: () => ({
      type: "volume",
      message:
        "Under 1 hour of focus this week — aim for at least 2–3 sessions today.",
      priority: "high",
    }),
  },
  {
    id: "great-weekly-volume",
    check: (stats) => stats.focus.weeklyMinutes > 600,
    result: (stats) => ({
      type: "volume",
      message: `${Math.round(stats.focus.weeklyMinutes / 60)} hours of focus this week — excellent! Make sure to rest too.`,
      priority: "low",
    }),
  },
];

/**
 * Get personalized recommendations for a user.
 *
 * @param {Object} stats - Output from aggregateUserStats()
 * @param {Object} [userSettings={}] - User.settings
 * @returns {{ recommendations: Array<{ type: string, message: string, priority: string }> }}
 */
function getRecommendations(stats, userSettings = {}) {
  if (!stats || stats.focus.totalSessions === 0) {
    return {
      recommendations: [
        {
          type: "onboarding",
          message:
            "Complete your first focus session to get personalized recommendations!",
          priority: "medium",
        },
      ],
    };
  }

  const triggered = [];

  for (const rule of RULES) {
    try {
      if (rule.check(stats, userSettings)) {
        triggered.push({ id: rule.id, ...rule.result(stats, userSettings) });
      }
    } catch {
      // Skip broken rules silently
    }
  }

  // Sort by priority and return top 3
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  triggered.sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1),
  );

  return { recommendations: triggered.slice(0, 3) };
}

module.exports = { getRecommendations, RULES };
