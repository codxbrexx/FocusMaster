const { generateJSON } = require("../llmService");

const INSIGHT_SYSTEM_INSTRUCTION = `You are a productivity coach analyzing a student's study data.

Rules:
- Insights should be specific observations about the user's patterns (e.g., "You focus best between 7–10 PM")
- Recommendations should be actionable changes (e.g., "Try 35-minute sessions instead of 25")
- Summary should be encouraging and personalized
- Keep each item under 100 characters
- Be conversational, not robotic`;

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

  return `User Statistics:
- Average focus session: ${stats.focus.avgDurationMin} minutes
- Session completion rate: ${stats.focus.completionRate}%
- Total focus this week: ${stats.focus.weeklyMinutes} minutes
- Current streak: ${stats.patterns.currentStreak} days
- Most productive hours: ${peakHoursFormatted || "not enough data"}
- Break frequency: ${stats.patterns.breakFrequency} breaks per focus session
- Task completion rate: ${stats.tasks.completionRate}%
- Productivity score: ${scoreResult.score}/100

Generate a JSON response with exactly this structure:
{
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recommendation1", "recommendation2"],
  "summary": "one motivational sentence",
  "prepAdvice": "A specific piece of advice on their exam/subject preparation based on their streak and focus."
}`;
}

/**
 * Validate and clean the parsed LLM JSON response.
 */
function parseInsightResponse(parsed) {
  if (!parsed || typeof parsed !== "object") parsed = {};
  const defaultInsights = ["We're analyzing your study patterns — keep recording focus sessions!"];
  const defaultRecommendations = ["Try starting with a 25-minute Pomodoro session to build momentum."];

  try {
    const rawInsights = Array.isArray(parsed.insights)
      ? parsed.insights.filter((i) => typeof i === "string" && i.trim()).slice(0, 3)
      : [];
    const rawRecommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter((r) => typeof r === "string" && r.trim()).slice(0, 2)
      : [];

    return {
      insights: rawInsights.length > 0 ? rawInsights : defaultInsights,
      recommendations: rawRecommendations.length > 0 ? rawRecommendations : defaultRecommendations,
      summary:
        typeof parsed.summary === "string" && parsed.summary.trim()
          ? parsed.summary
          : "Every session counts — keep going!",
      prepAdvice:
        typeof parsed.prepAdvice === "string" && parsed.prepAdvice.trim()
          ? parsed.prepAdvice
          : "Consistency is key to mastering your subjects.",
    };
  } catch {
    // Fallback if parsing fails
    return {
      insights: defaultInsights,
      recommendations: defaultRecommendations,
      summary: "Every session counts — keep going!",
      prepAdvice: "Consistency is key to mastering your subjects.",
    };
  }
}

/**
 * Generate AI insights from pre-aggregated stats and a pre-computed score.
 *
 * This function is a pure data-transformation layer:
 *   1. Build prompt from stats + score
 *   2. Call LLM
 *   3. Parse response
 *   4. Return structured result
 *
 * It does NOT access the database. The caller (controller) is responsible
 * for cache checks, cache writes, and fetching stats/score.
 *
 * @param {Object} stats       
 * @param {Object} scoreResult 
 * @returns {Promise<Object>}  
 */
async function generateInsights(stats, scoreResult) {
  const prompt = buildInsightPrompt(stats, scoreResult);

  // Let LLM errors propagate to the caller so the controller's
  // stale-cache → fallback hierarchy can kick in.
  const llmResponse = await generateJSON(prompt, {
    maxOutputTokens: 400,
    temperature: 0.4,
    systemInstruction: INSIGHT_SYSTEM_INSTRUCTION,
    label: "insights",
  });

  return parseInsightResponse(llmResponse);
}

module.exports = { generateInsights, buildInsightPrompt, parseInsightResponse };
