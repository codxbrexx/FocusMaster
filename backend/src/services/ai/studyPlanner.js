const { generateJSON } = require("../llmService");
const { differenceInWeeks, format } = require("date-fns");

/**
 * Build a compact prompt for study plan generation.
 */
const PLANNER_SYSTEM_INSTRUCTION = `You are a study planner AI. Generate structured, realistic weekly study plans.

Rules:
- Spread subjects across the week, harder subjects during peak hours
- Include revision and practice days
- Last 1-2 weeks should focus on revision and mock tests
- Activity types: Study, Revision, Practice, Mock Test
- Include all 7 days (Monday to Sunday) with lighter loads on weekends
- Keep it realistic and achievable`;

/**
 * Build a compact prompt for study plan generation.
 */
function buildPlannerPrompt(profile, stats) {
  const subjectList = (profile.subjects || [])
    .map((s) => `${s.name} (${s.difficulty || "medium"})`)
    .join(", ");

  const peakHoursFormatted = (stats.patterns.peakHours || [])
    .map((h) => {
      const hour12 = h % 12 || 12;
      const ampm = h < 12 ? "AM" : "PM";
      return `${hour12} ${ampm}`;
    })
    .join(", ");

  const examDate = profile.examDate
    ? format(new Date(profile.examDate), "yyyy-MM-dd")
    : "not set";

  const weeksUntilExam = profile.examDate
    ? Math.max(differenceInWeeks(new Date(profile.examDate), new Date()), 1)
    : 4;

  return `Student Profile:
- Stream: ${profile.stream || "general"}${profile.customStreamName ? ` (${profile.customStreamName})` : ""}
- Subjects: ${subjectList || "not specified"}
- Exam date: ${examDate}
- Weeks until exam: ${weeksUntilExam}
- Available hours/day: ${profile.availableHoursPerDay || 4}
- Weekly goal: ${profile.weeklyGoalHours || 20} hours

Productivity Data:
- Best study hours: ${peakHoursFormatted || "not enough data"}
- Average focus duration: ${stats.focus.avgDurationMin} minutes
- Session completion rate: ${stats.focus.completionRate}%

Generate a study plan for ${Math.min(weeksUntilExam, 8)} weeks. Total daily hours must not exceed ${profile.availableHoursPerDay || 4}.

Return a JSON object with this exact structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Foundation concepts",
      "dailyPlans": [
        {
          "day": "Monday",
          "subjects": [
            { "name": "Subject Name", "hours": 2, "activity": "Study" }
          ]
        }
      ]
    }
  ]
}`;
}

/**
 * Validate the parsed LLM study plan response.
 * With generateJSON(), the response is already a parsed JS object.
 */
function parsePlanResponse(parsed, weeksCount) {
  try {
    if (parsed && Array.isArray(parsed.weeks) && parsed.weeks.length > 0) {
      return parsed.weeks.slice(0, weeksCount);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate a study plan from a user's profile and aggregated stats.
 *
 * This function is a pure data-transformation layer:
 *   1. Build prompt from profile + stats
 *   2. Call LLM
 *   3. Parse response into structured weeks
 *   4. Return the parsed weeks array (or null on failure)
 *
 * It does NOT access the database. The caller (controller) is responsible
 * for fetching the profile/stats, checking for existing plans, and saving.
 *
 * @param {Object} profile 
 * @param {Object} stats 
 * @returns {Promise<{ weeks: Array|null, error: string|null }>}
 */
async function generateStudyPlan(profile, stats) {
  if (!profile.stream && (!profile.subjects || profile.subjects.length === 0)) {
    return {
      weeks: null,
      error: "Please set up your study profile first (stream and subjects).",
    };
  }

  const weeksUntilExam = profile.examDate
    ? Math.max(differenceInWeeks(new Date(profile.examDate), new Date()), 1)
    : 4;
  const planWeeks = Math.min(weeksUntilExam, 8);

  const prompt = buildPlannerPrompt(profile, stats);
  const llmResponse = await generateJSON(prompt, {
    maxOutputTokens: 2000,
    temperature: 0.3,
    systemInstruction: PLANNER_SYSTEM_INSTRUCTION,
    label: "study-planner",
  });
  const weeks = parsePlanResponse(llmResponse, planWeeks);

  if (!weeks) {
    return { weeks: null, error: "Could not parse AI response. Please try again." };
  }

  return { weeks, error: null };
}

module.exports = { generateStudyPlan, buildPlannerPrompt, parsePlanResponse };
