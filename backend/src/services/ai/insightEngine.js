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
  if (!parsed) parsed = {};
  try {
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
  try {
    const llmResponse = await generateJSON(prompt, {
      max_tokens: 400,
      temperature: 0.4,
      systemInstruction: INSIGHT_SYSTEM_INSTRUCTION,
    });
    return parseInsightResponse(llmResponse);
  } catch (error) {
    console.error("Error generating insights:", error);
    return parseInsightResponse(null);
  }
}

module.exports = { generateInsights, buildInsightPrompt, parseInsightResponse };
