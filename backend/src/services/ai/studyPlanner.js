const User = require("../../models/User");
const StudyPlan = require("../../models/StudyPlan");
const { aggregateUserStats } = require("../analytics/aggregator");
const { generate } = require("../llmService");
const { differenceInWeeks, addWeeks, format } = require("date-fns");

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

  return `You are a study planner for a ${profile.stream || "general"} student.

Student Profile:
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

Generate a study plan for ${Math.min(weeksUntilExam, 8)} weeks as JSON (no markdown fences):
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
}

Rules:
- Spread subjects across the week, harder subjects during peak hours
- Include revision and practice days
- Total daily hours must not exceed ${profile.availableHoursPerDay || 4}
- Last 1-2 weeks should focus on revision and mock tests
- Activity types: Study, Revision, Practice, Mock Test
- Include all 7 days (Monday to Sunday) with lighter loads on weekends
- Keep it realistic and achievable`;
}

/**
 * Parse the LLM study plan response.
 */
function parsePlanResponse(text, weeksCount) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed.weeks) && parsed.weeks.length > 0) {
      return parsed.weeks.slice(0, weeksCount);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate or retrieve a study plan for a user.
 *
 * @param {string} userId
 * @param {boolean} [forceRegenerate=false] - If true, regenerate even if a plan exists
 */
async function generateStudyPlan(userId, forceRegenerate = false) {
  // Check for existing plan if not forcing regeneration
  if (!forceRegenerate) {
    const existing = await StudyPlan.findOne({ user: userId })
      .sort({ generatedAt: -1 })
      .lean();

    if (existing) {
      return { plan: existing, fromCache: true };
    }
  }

  // Fetch user profile and stats
  const user = await User.findById(userId).select("studyProfile settings");
  const profile = user.studyProfile || {};

  if (!profile.stream && (!profile.subjects || profile.subjects.length === 0)) {
    return {
      plan: null,
      error: "Please set up your study profile first (stream and subjects).",
    };
  }

  const stats = await aggregateUserStats(userId, 30);

  const weeksUntilExam = profile.examDate
    ? Math.max(differenceInWeeks(new Date(profile.examDate), new Date()), 1)
    : 4;
  const planWeeks = Math.min(weeksUntilExam, 8);

  // Call LLM
  let weeks;
  try {
    const prompt = buildPlannerPrompt(profile, stats);
    const llmResponse = await generate(prompt, null, {
      max_tokens: 2000,
      temperature: 0.3,
    });
    weeks = parsePlanResponse(llmResponse, planWeeks);
  } catch (err) {
    // If LLM fails, return existing plan or error
    const fallback = await StudyPlan.findOne({ user: userId })
      .sort({ generatedAt: -1 })
      .lean();

    if (fallback) {
      return { plan: fallback, fromCache: true, stale: true };
    }
    return { plan: null, error: "Failed to generate study plan. Please try again later." };
  }

  if (!weeks) {
    return { plan: null, error: "Could not parse AI response. Please try again." };
  }

  // Add dates to weeks
  const now = new Date();
  const weeksWithDates = weeks.map((week, i) => ({
    ...week,
    weekNumber: i + 1,
    startDate: addWeeks(now, i),
    endDate: addWeeks(now, i + 1),
  }));

  // Save plan (replace existing)
  const saved = await StudyPlan.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      weeks: weeksWithDates,
      examDate: profile.examDate,
      totalWeeks: planWeeks,
      stream: profile.stream,
      subjects: (profile.subjects || []).map((s) => s.name),
      generatedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  return { plan: saved, fromCache: false };
}

module.exports = { generateStudyPlan, buildPlannerPrompt, parsePlanResponse };
