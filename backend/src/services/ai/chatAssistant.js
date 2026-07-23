const { generate } = require("../llmService");
const { aggregateUserStats } = require("../analytics/aggregator");
const StudyProfile = require("../../models/StudyProfile");
const StudyPlan = require("../../models/StudyPlan");

/**
 * Handle a general study chat query from the user, providing LLM with context
 * about their study profile, plan, and recent focus stats.
 * 
 * @param {string} userId 
 * @param {string} message 
 * @param {Array<{role: string, text: string}>} history 
 */
async function handleStudyChat(userId, message, history = []) {
  try {
    // Gather context
    const stats = await aggregateUserStats(userId, 30);
    const studyProfile = await StudyProfile.findOne({ user: userId }).lean();
    const studyPlan = await StudyPlan.findOne({ user: userId }).sort({ generatedAt: -1 }).lean();

    // Format context for LLM
    let contextStr = "User Study Context:\n";
    if (studyProfile && studyProfile.stream) {
      contextStr += `- Stream/Goal: ${studyProfile.customStreamName || studyProfile.stream}\n`;
      contextStr += `- Subjects: ${studyProfile.subjects.map(s => s.name).join(", ")}\n`;
      if (studyProfile.examDate) {
        contextStr += `- Exam Date: ${new Date(studyProfile.examDate).toLocaleDateString()}\n`;
      }
    } else {
      contextStr += `- Study Profile: Not completely set up yet.\n`;
    }

    if (stats) {
      contextStr += `- Recent Focus Stats (last 30 days): ${stats.focus.totalSessions} sessions, ${stats.focus.totalMinutes} total minutes focused.\n`;
      contextStr += `- Task Completion Rate: ${Math.round(stats.tasks.completionRate)}%\n`;
      contextStr += `- Current Streak: ${stats.patterns.currentStreak} days\n`;
    }

    if (studyPlan && studyPlan.weeks && studyPlan.weeks.length > 0) {
      const currentWeek = studyPlan.weeks[0];
      contextStr += `- Current Study Plan Week: ${currentWeek.weekNumber} (${currentWeek.theme})\n`;
    }

    // Build the system prompt
    let prompt = `You are an expert, encouraging AI study coach and preparation analyzer.
You are helping a student prepare and analyze their study progress based on their personalized data.

${contextStr}

Be concise, supportive, and highly actionable. Answer the user's latest message based on this context. Do not use Markdown headings like # or ## if possible, just use bold text and lists for clean chat rendering.

Chat History:
`;

    // Append history (limit to last 6 messages to save tokens)
    const recentHistory = history.slice(-6);
    recentHistory.forEach(msg => {
      prompt += `${msg.role === 'user' ? 'Student' : 'Coach'}: ${msg.text}\n`;
    });

    prompt += `Student: ${message}\nCoach:`;

    const answer = await generate(prompt, null, {
      temperature: 0.7,
      max_tokens: 600,
    });

    return { answer: answer.trim() };
  } catch (error) {
    console.error("Error in handleStudyChat:", error);
    return { error: "I'm having trouble analyzing your study data right now. Please try again later." };
  }
}

module.exports = {
  handleStudyChat,
};
