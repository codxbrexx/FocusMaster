/**
 * Productivity Score Calculator
 *
 * Computes a 0–100 score from aggregated stats:
 *   - Consistency (streak):       30%
 *   - Completion rate:            25%
 *   - Focus quality (duration):   25%
 *   - Time management (peak hrs): 20%
 *
 * @param {Object} stats  - Output of aggregateUserStats()
 * @param {Object} userSettings - User.settings subdocument
 * @returns {{ score: number, breakdown: Object }}
 */
function calculateProductivityScore(stats, userSettings = {}) {
  const configuredFocus = userSettings.focusDuration || 25; // minutes

  // Consistency (30%) — streak capped at 30 days
  const streakMax = 30;
  const streakRaw = Math.min(stats.patterns.currentStreak, streakMax);
  const consistencyScore = Math.round((streakRaw / streakMax) * 100);

  // Completion rate (25%) — direct percentage
  const completionScore = stats.focus.completionRate;

  // ── Focus quality (25%) — how close avg duration is to configured ─
  // If avg >= configured → 100. If avg is 0 → 0. Linear in between.
  const avgMin = stats.focus.avgDurationMin;
  const focusQuality =
    avgMin >= configuredFocus
      ? 100
      : configuredFocus > 0
        ? Math.round((avgMin / configuredFocus) * 100)
        : 0;

  // ── Time management (20%) — % of sessions in personal peak hours ──
  // We can't re-query sessions here (aggregator already computed peaks),
  // so we use a heuristic: if the user has identified peak hours AND
  // has been doing sessions, award points based on session volume.
  // A more precise version would require the aggregator to also return
  // "sessions in peak hours count", which we can add later.
  // For now: having ≥3 peak hours identified = good time awareness.
  const peakHourCount = (stats.patterns.peakHours || []).length;
  const hasEnoughData = stats.focus.totalSessions >= 5;
  const timeManagement = hasEnoughData
    ? Math.min(Math.round((peakHourCount / 3) * 100), 100)
    : 0;

  // Weighted total
  const score = Math.round(
    consistencyScore * 0.3 +
      completionScore * 0.25 +
      focusQuality * 0.25 +
      timeManagement * 0.2,
  );

  return {
    score: Math.min(score, 100),
    breakdown: {
      consistency: { score: consistencyScore, weight: 30, streak: streakRaw },
      completion: { score: completionScore, weight: 25 },
      focusQuality: {
        score: focusQuality,
        weight: 25,
        avgMin,
        targetMin: configuredFocus,
      },
      timeManagement: {
        score: timeManagement,
        weight: 20,
        peakHours: stats.patterns.peakHours,
      },
    },
  };
}

module.exports = { calculateProductivityScore };
