const { aggregateUserStats } = require("../analytics/aggregator");
const { calculateProductivityScore } = require("../analytics/productivityScore");
const { calculateExamReadinessAndBurnout } = require("./insightEngine");
const { generateJSON } = require("../llmService");

const WEEKLY_DIGEST_SYSTEM_INSTRUCTION = `You are an elite academic productivity strategist.
Analyze the student's 7-day performance data and generate a clear, motivating, and actionable Weekly Performance Digest.
Keep headlines punchy, key highlights concrete, and next week action steps high-impact.`;

/**
 * Build the prompt for weekly digest generation.
 */
function buildWeeklyDigestPrompt(stats, scoreResult, profile = {}) {
  const stream = profile.stream || profile.customStreamName || "General Academic";
  const weeklyMins = stats.focus?.weeklyMinutes || 0;
  const weeklyHours = (weeklyMins / 60).toFixed(1);
  const { examReadinessScore, burnoutRisk } = calculateExamReadinessAndBurnout(stats, scoreResult, profile);

  return `Student Profile:
- Study Stream: ${stream}
- Weekly Focus Hours: ${weeklyHours} hrs
- Sessions Completed: ${stats.focus?.totalSessions || 0}
- Active Streak: ${stats.patterns?.currentStreak || 0} days
- Task Completion Rate: ${stats.tasks?.completionRate || 0}%
- Productivity Score: ${scoreResult.score}/100
- Exam Readiness Score: ${examReadinessScore}%
- Burnout Risk Level: ${burnoutRisk.toUpperCase()}

Generate a JSON response with this exact structure:
{
  "headline": "A concise headline capturing their weekly performance narrative (max 10 words)",
  "keyHighlights": [
    "highlight 1 regarding focus time or streak",
    "highlight 2 regarding subject focus or completion",
    "highlight 3 regarding energy window or habit consistency"
  ],
  "nextWeekAction": "One clear, strategic action item to execute next week"
}`;
}

/**
 * Generate a weekly performance digest for a user.
 *
 * @param {string|ObjectId} userId
 * @param {Object} [userSettings]
 * @param {Object} [userProfile]
 * @returns {Promise<Object>}
 */
async function generateWeeklyDigest(userId, userSettings = {}, userProfile = {}) {
  const stats = await aggregateUserStats(userId);
  const scoreResult = calculateProductivityScore(stats, userSettings);
  const metrics = calculateExamReadinessAndBurnout(stats, scoreResult, userProfile);

  const prompt = buildWeeklyDigestPrompt(stats, scoreResult, userProfile);

  let llmResponse = null;
  try {
    llmResponse = await generateJSON(prompt, {
      maxOutputTokens: 400,
      temperature: 0.3,
      systemInstruction: WEEKLY_DIGEST_SYSTEM_INSTRUCTION,
      label: "weekly-digest",
    });
  } catch (err) {
    console.warn("[weeklyDigestService] LLM unavailable, using rule-based digest:", err.message);
  }

  const weeklyMins = stats.focus?.weeklyMinutes || 0;
  const weeklyHours = Number((weeklyMins / 60).toFixed(1));

  let headline = `Weekly Review: ${weeklyHours} hrs of focused study completed`;
  let keyHighlights = [
    `Logged ${stats.focus?.totalSessions || 0} focus sessions totaling ${weeklyHours} hours this week.`,
    `Maintained an active focus streak of ${stats.patterns?.currentStreak || 0} days.`,
    `Achieved a task completion rate of ${stats.tasks?.completionRate || 0}%.`,
  ];
  let nextWeekAction = "Maintain consistent daily focus blocks during your peak energy hours.";

  if (llmResponse && typeof llmResponse === "object") {
    if (typeof llmResponse.headline === "string" && llmResponse.headline.trim()) {
      headline = llmResponse.headline.trim();
    }
    if (Array.isArray(llmResponse.keyHighlights) && llmResponse.keyHighlights.length > 0) {
      keyHighlights = llmResponse.keyHighlights
        .filter((h) => typeof h === "string" && h.trim())
        .slice(0, 3);
    }
    if (typeof llmResponse.nextWeekAction === "string" && llmResponse.nextWeekAction.trim()) {
      nextWeekAction = llmResponse.nextWeekAction.trim();
    }
  }

  return {
    weeklyFocusHours: weeklyHours,
    sessionsCompleted: stats.focus?.totalSessions || 0,
    streakDays: stats.patterns?.currentStreak || 0,
    productivityScore: scoreResult.score,
    examReadinessScore: metrics.examReadinessScore,
    burnoutRisk: metrics.burnoutRisk,
    headline,
    keyHighlights,
    nextWeekAction,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  generateWeeklyDigest,
  buildWeeklyDigestPrompt,
};
