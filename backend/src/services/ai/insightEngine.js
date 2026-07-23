const AiInsight = require("../../models/AiInsight");
const { aggregateUserStats } = require("../analytics/aggregator");
const {
  calculateProductivityScore,
} = require("../analytics/productivityScore");
const { generate } = require("../llmService");

const CACHE_HOURS = 24;

/**
 * Build a compact prompt from pre-aggregated stats.
 * Follows the architecture doc's prompt strategy: never send raw sessions.
 */
function buildInsightPrompt(stats, scoreResult) {
  const peakHoursFormatted = (stats.patterns.peakHours || [])
    .map((h) => {
      const hour12 = h % 12 || 12;
      const ampm = h < 12 ? "AM" : "PM";
      return `${hour12} ${ampm}`;
    })
    .join(", ");

  return `You are a productivity coach analyzing a student's study data.

User Statistics:
- Average focus session: ${stats.focus.avgDurationMin} minutes
- Session completion rate: ${stats.focus.completionRate}%
- Total focus this week: ${stats.focus.weeklyMinutes} minutes
- Current streak: ${stats.patterns.currentStreak} days
- Most productive hours: ${peakHoursFormatted || "not enough data"}
- Break frequency: ${stats.patterns.breakFrequency} breaks per focus session
- Task completion rate: ${stats.tasks.completionRate}%
- Productivity score: ${scoreResult.score}/100

Generate a JSON response with exactly this structure (no markdown, no code fences):
{
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recommendation1", "recommendation2"],
  "summary": "one motivational sentence",
  "prepAdvice": "A specific piece of advice on their exam/subject preparation based on their streak and focus."
}

Rules:
- Insights should be specific observations about the user's patterns (e.g., "You focus best between 7–10 PM")
- Recommendations should be actionable changes (e.g., "Try 35-minute sessions instead of 25")
- Summary should be encouraging and personalized
- Keep each item under 100 characters
- Be conversational, not robotic`;
}

/**
 * Parse the LLM response into structured data.
 * Handles common issues: markdown fences, partial JSON, etc.
 */
function parseInsightResponse(text) {
  try {
    // Strip markdown code fences if present
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(cleaned);

    return {
      insights: Array.isArray(parsed.insights)
        ? parsed.insights.slice(0, 3)
        : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.slice(0, 2)
        : [],
      summary:
        typeof parsed.summary === "string"
          ? parsed.summary
          : "Keep up the great work!",
      prepAdvice:
        typeof parsed.prepAdvice === "string"
          ? parsed.prepAdvice
          : "Stay consistent with your preparation!",
    };
  } catch {
    // Fallback if parsing fails
    return {
      insights: ["We're still analyzing your patterns — check back soon."],
      recommendations: [
        "Complete a few more focus sessions for personalized tips.",
      ],
      summary: "Every session counts — keep going!",
      prepAdvice: "Consistency is key to mastering your subjects.",
    };
  }
}

/**
 * Generate AI insights for a user.
 *
 * Flow:
 *   1. Check cache → return if valid
 *   2. Aggregate stats → build prompt → call LLM → parse
 *   3. Save to cache → return
 *
 * If LLM fails, returns stale cache or a fallback.
 */
async function generateInsights(userId, userSettings = {}) {
  // ── 1. Check cache ──────────────────────────────────────────────
  const cached = await AiInsight.findOne({
    user: userId,
    expiresAt: { $gt: new Date() },
  })
    .sort({ generatedAt: -1 })
    .lean();

  if (cached) {
    return {
      insights: cached.insights,
      recommendations: cached.recommendations,
      summary: cached.summary,
      prepAdvice: cached.prepAdvice || "Keep up your preparation!",
      productivityScore: cached.productivityScore,
      scoreBreakdown: cached.scoreBreakdown,
      stats: cached.stats,
      generatedAt: cached.generatedAt,
      fromCache: true,
    };
  }

  // ── 2. Aggregate + Score ────────────────────────────────────────
  const stats = await aggregateUserStats(userId, 30);
  const scoreResult = calculateProductivityScore(stats, userSettings);

  // ── 3. Call LLM ─────────────────────────────────────────────────
  let parsed;
  try {
    const prompt = buildInsightPrompt(stats, scoreResult);
    const llmResponse = await generate(prompt, null, {
      max_tokens: 400,
      temperature: 0.4,
    });
    parsed = parseInsightResponse(llmResponse);
  } catch (err) {
    // LLM failed — try stale cache
    const stale = await AiInsight.findOne({ user: userId })
      .sort({ generatedAt: -1 })
      .lean();

    if (stale) {
      return {
        insights: stale.insights,
        recommendations: stale.recommendations,
        summary: stale.summary,
        prepAdvice: stale.prepAdvice || "Keep up your preparation!",
        productivityScore: scoreResult.score,
        scoreBreakdown: scoreResult.breakdown,
        stats,
        generatedAt: stale.generatedAt,
        fromCache: true,
        stale: true,
      };
    }

    // No cache at all — return fallback
    parsed = parseInsightResponse("invalid");
  }

  // ── 4. Save to cache ────────────────────────────────────────────
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_HOURS * 60 * 60 * 1000);

  const saved = await AiInsight.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      summary: parsed.summary,
      prepAdvice: parsed.prepAdvice,
      productivityScore: scoreResult.score,
      scoreBreakdown: scoreResult.breakdown,
      stats,
      generatedAt: now,
      expiresAt,
    },
    { upsert: true, new: true },
  );

  return {
    insights: saved.insights,
    recommendations: saved.recommendations,
    summary: saved.summary,
    prepAdvice: saved.prepAdvice || parsed.prepAdvice,
    productivityScore: scoreResult.score,
    scoreBreakdown: scoreResult.breakdown,
    stats,
    generatedAt: saved.generatedAt,
    fromCache: false,
  };
}

module.exports = { generateInsights, buildInsightPrompt, parseInsightResponse };
