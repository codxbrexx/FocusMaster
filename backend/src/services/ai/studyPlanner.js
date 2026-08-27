const { generateJSON } = require("../llmService");
const { differenceInWeeks, format, addDays } = require("date-fns");

const PLANNER_SYSTEM_INSTRUCTION = `You are a master academic architect creating high-yielding study plans for competitive exams (JEE, NEET, GATE, UPSC, CA, Engineering, Medical, Commerce, etc.).

Strategic Directives:
- Tailor subject allocation to subject difficulty (Hard subjects during peak energy hours).
- Integrate active recall, formula review, numerical practice, or answer-writing blocks based on the stream.
- Allocate structured revision loops every week and mock test buffers as the exam approaches.
- Keep daily study load strictly under available daily hours.
- Valid Activity Types: "Study", "Revision", "Practice", "Mock Test".`;

/**
 * Build a compact prompt for study plan generation.
 */
function buildPlannerPrompt(profile, stats) {
  const stream = profile.stream || profile.customStreamName || "General Academic";

  const subjectList = (profile.subjects || [])
    .map((s) => typeof s === "object" ? `${s.name} (${s.difficulty || "medium"})` : s)
    .join(", ");

  const peakHoursFormatted = (stats.patterns?.peakHours || [])
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
- Target Stream: ${stream}
- Core Subjects: ${subjectList || "General"}
- Exam Date: ${examDate}
- Countdown: ${weeksUntilExam} weeks
- Daily Available Study Capacity: ${profile.availableHoursPerDay || 4} hours
- Target Weekly Study Goal: ${profile.weeklyGoalHours || 20} hours

Historical Analytics:
- Peak Energy Hours: ${peakHoursFormatted || "Variable"}
- Avg Focus Duration: ${stats.focus?.avgDurationMin || 30} minutes
- Session Completion Rate: ${stats.focus?.completionRate || 80}%

Task: Generate a ${Math.min(weeksUntilExam, 8)}-week structured study plan optimized for ${stream}.
Return a JSON object with this exact structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Core Concepts & Foundation Building",
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
 * Fallback study plan generator when LLM is unconfigured or unreachable.
 */
function generateFallbackStudyPlan(profile, planWeeks) {
  const subjects = (profile.subjects || []).map(s => typeof s === "object" ? s.name : s);
  const activeSubjects = subjects.length > 0 ? subjects : ["Core Topic 1", "Core Topic 2"];
  const dailyCap = Math.min(profile.availableHoursPerDay || 4, 8);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const weeks = [];
  const themes = [
    "Core Foundation & Theory Deep Dive",
    "High-Yield Problem Sets & Applied Concepts",
    "Weak-Area Strengthening & Active Recall",
    "Comprehensive Revision & Full-Length Practice Tests"
  ];

  for (let w = 1; w <= planWeeks; w++) {
    const theme = themes[(w - 1) % themes.length];
    const dailyPlans = daysOfWeek.map((day, dIdx) => {
      const isWeekend = dIdx >= 5;
      const primarySubj = activeSubjects[(w + dIdx) % activeSubjects.length];
      const secondarySubj = activeSubjects[(w + dIdx + 1) % activeSubjects.length];

      const hrs1 = isWeekend ? Math.max(1, Math.floor(dailyCap / 2)) : Math.max(1, dailyCap - 1);
      const hrs2 = isWeekend ? 1 : 1;

      return {
        day,
        subjects: [
          { name: primarySubj, hours: hrs1, activity: isWeekend ? "Revision" : "Study" },
          ...(secondarySubj && secondarySubj !== primarySubj
            ? [{ name: secondarySubj, hours: hrs2, activity: isWeekend ? "Mock Test" : "Practice" }]
            : [])
        ]
      };
    });

    weeks.push({ weekNumber: w, theme, dailyPlans });
  }

  return weeks;
}

/**
 * Validate the parsed LLM study plan response.
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
 * Generate a study plan from user profile and aggregated stats.
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
  try {
    const llmResponse = await generateJSON(prompt, {
      maxOutputTokens: 2000,
      temperature: 0.3,
      systemInstruction: PLANNER_SYSTEM_INSTRUCTION,
      label: "study-planner",
    });
    let weeks = parsePlanResponse(llmResponse, planWeeks);

    if (!weeks) {
      weeks = generateFallbackStudyPlan(profile, planWeeks);
    }

    return { weeks, error: null };
  } catch (err) {
    console.warn("[StudyPlanner] Using stream fallback plan due to LLM error:", err.message);
    const fallbackWeeks = generateFallbackStudyPlan(profile, planWeeks);
    return { weeks: fallbackWeeks, error: null };
  }
}

module.exports = {
  generateStudyPlan,
  buildPlannerPrompt,
  parsePlanResponse,
  generateFallbackStudyPlan,
};
