const { generateJSON } = require("../llmService");

const INSIGHT_SYSTEM_INSTRUCTION = `You are a high-performance academic strategist and mentor specializing in competitive exam preparation and deep-work study discipline.

Tone and Character:
- Direct, sharp, deeply practical, and empathetic.
- NEVER use generic AI platitudes ("Keep up the great work!", "Stay consistent!", "Supercharge your routine").
- Talk like a seasoned professor or top-rank exam mentor analyzing a real student's workload.
- Focus on subject stamina, cognitive fatigue, peak energy windows, and active retention cycles.
- Custom-tailor advice to their specific study stream (e.g. JEE/GATE numerical sprints, NEET high-yield biology recall, UPSC answer synthesis, CA audit drills).`;

/**
 * Calculate dynamic Exam Readiness Score (0-100%) and Burnout Risk level.
 *
 * @param {Object} stats
 * @param {Object} scoreResult
 * @param {Object} profile
 * @returns {{ examReadinessScore: number, burnoutRisk: "low" | "moderate" | "high" }}
 */
function calculateExamReadinessAndBurnout(stats, scoreResult, profile = {}) {
  const prodScore = scoreResult.score || 50;
  const completionRate = stats.tasks?.completionRate || 50;
  const focusCompletion = stats.focus?.completionRate || 50;

  // 1. Exam Readiness Score (0-100)
  // Weighted: 40% Productivity score, 30% Task completion, 30% Session completion
  let readiness = Math.round(
    prodScore * 0.4 + completionRate * 0.3 + focusCompletion * 0.3
  );

  // Bonus for streak momentum
  if (stats.patterns?.currentStreak >= 7) readiness = Math.min(100, readiness + 5);

  // 2. Burnout Risk ("low" | "moderate" | "high")
  const weeklyMins = stats.focus?.weeklyMinutes || 0;
  const breakFreq = stats.patterns?.breakFrequency ?? 1;

  let burnoutRisk = "low";
  // Heavy hours (>35 hours/week) with low breaks (<0.5 per session) or low focus completion (<60%) indicates fatigue/burnout
  if (weeklyMins > 2100 && (breakFreq < 0.5 || focusCompletion < 60)) {
    burnoutRisk = "high";
  } else if (weeklyMins > 1400 && breakFreq < 0.8) {
    burnoutRisk = "moderate";
  } else if (focusCompletion < 50 && stats.focus?.totalSessions > 5) {
    burnoutRisk = "moderate";
  }

  return {
    examReadinessScore: readiness,
    burnoutRisk,
  };
}

/**
 * Build a compact prompt from pre-aggregated stats and profile context.
 */
function buildInsightPrompt(stats, scoreResult, profile = {}) {
  const stream = profile.stream || profile.customStreamName || "General Academic";
  const subjectsStr = (profile.subjects || []).map(s => typeof s === "object" ? s.name : s).join(", ");
  
  const peakHoursFormatted = (stats.patterns?.peakHours || [])
    .map((h) => {
      const hour12 = h % 12 || 12;
      const ampm = h < 12 ? "AM" : "PM";
      return `${hour12} ${ampm}`;
    })
    .join(", ");

  const { examReadinessScore, burnoutRisk } = calculateExamReadinessAndBurnout(stats, scoreResult, profile);

  return `Student Profile:
- Stream: ${stream}
- Target Subjects: ${subjectsStr || "General"}
- Productivity Score: ${scoreResult.score}/100
- Exam Readiness Score: ${examReadinessScore}%
- Burnout Risk Level: ${burnoutRisk.toUpperCase()}

Performance Metrics:
- Avg Focus Block: ${stats.focus?.avgDurationMin || 0} mins
- Session Completion: ${stats.focus?.completionRate || 0}%
- Total Weekly Focus: ${stats.focus?.weeklyMinutes || 0} mins (${Math.round((stats.focus?.weeklyMinutes || 0)/60)} hrs)
- Active Streak: ${stats.patterns?.currentStreak || 0} days
- Peak Energy Hours: ${peakHoursFormatted || "Variable"}
- Task Completion Rate: ${stats.tasks?.completionRate || 0}%

Generate a JSON response with this exact structure:
{
  "insights": ["stream-tailored observation 1", "stream-tailored observation 2", "observation 3"],
  "recommendations": ["concrete action step 1", "concrete action step 2"],
  "summary": "a sharp, authentic mentor summary of their current momentum",
  "prepAdvice": "stream-specific subject advice (e.g. revision cycle or formula recall tip)"
}`;
}

/**
 * Validate and clean the parsed LLM JSON response.
 */
function parseInsightResponse(parsed, stream = "General") {
  if (!parsed || typeof parsed !== "object") parsed = {};

  const streamDefaultInsights = {
    engineering: ["Peak cognitive output occurs during mid-day blocks.", "Uninterrupted problem-solving blocks increase equation mastery."],
    medical: ["Active recall flashcards yield higher retention than passive reading.", "Late night study blocks show a slight focus drop-off."],
    upsc: ["Consistency in answer writing during peak hours builds exam endurance.", "Break frequency is key during 3-hour long-form study blocks."],
    default: ["Your focus momentum builds fastest after the first 15 minutes of a block.", "Maintaining session completion rates keeps your readiness trend positive."]
  };

  const selectedKey = (stream || "").toLowerCase();
  const defaultInsights = streamDefaultInsights[selectedKey] || streamDefaultInsights.default;
  const defaultRecommendations = ["Schedule deep-work problem sets during your peak focus window.", "Use 5-minute active recovery breaks between focus blocks to maintain cognitive energy."];

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
          : "Focus on execution and high-priority topics during peak hours.",
      prepAdvice:
        typeof parsed.prepAdvice === "string" && parsed.prepAdvice.trim()
          ? parsed.prepAdvice
          : "Prioritize active recall and weak-topic revision in your upcoming study blocks.",
    };
  } catch {
    return {
      insights: defaultInsights,
      recommendations: defaultRecommendations,
      summary: "Focus on execution and high-priority topics during peak hours.",
      prepAdvice: "Prioritize active recall and weak-topic revision in your upcoming study blocks.",
    };
  }
}

/**
 * Generate AI insights from pre-aggregated stats and a pre-computed score.
 */
async function generateInsights(stats, scoreResult, profile = {}) {
  const prompt = buildInsightPrompt(stats, scoreResult, profile);
  const metrics = calculateExamReadinessAndBurnout(stats, scoreResult, profile);

  const llmResponse = await generateJSON(prompt, {
    maxOutputTokens: 500,
    temperature: 0.3,
    systemInstruction: INSIGHT_SYSTEM_INSTRUCTION,
    label: "insights",
  });

  const parsed = parseInsightResponse(llmResponse, profile.stream);

  return {
    ...parsed,
    examReadinessScore: metrics.examReadinessScore,
    burnoutRisk: metrics.burnoutRisk,
  };
}

module.exports = {
  generateInsights,
  buildInsightPrompt,
  parseInsightResponse,
  calculateExamReadinessAndBurnout,
};
