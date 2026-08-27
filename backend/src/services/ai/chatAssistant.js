const { generate } = require("../llmService");

/**
 * Handle a general study chat query from the user, providing LLM with context
 * about their study profile, plan, and recent focus stats.
 *
 * This function is a pure data-transformation layer. It does NOT access
 * the database. The caller (controller) must fetch stats, profile, and
 * plan from the DB and pass them in via the `contextData` argument.
 *
 * @param {string} message
 * @param {Array<{role: string, text: string}>} history 
 * @param {Object} contextData   
 * @param {Object} [contextData.stats]        
 * @param {Object} [contextData.studyProfile] 
 * @param {Object} [contextData.studyPlan]    
 */
async function handleStudyChat(message, history = [], contextData = {}) {
  const { stats, studyProfile, studyPlan } = contextData;

  // Format context for LLM
  let contextStr = "User Study Context:\n";
  if (studyProfile && studyProfile.stream) {
    contextStr += `- Stream/Goal: ${studyProfile.customStreamName || studyProfile.stream}\n`;
    contextStr += `- Subjects: ${(studyProfile.subjects || []).map(s => s.name).join(", ")}\n`;
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

  // Build system instruction (separated from user prompt for lower token cost)
  const systemInstruction = `You are an expert, encouraging AI study coach and preparation analyzer.
You are helping a student prepare and analyze their study progress based on their personalized data.

${contextStr}

Be concise, supportive, and highly actionable. Answer the user's latest message based on this context. Do not use Markdown headings like # or ## if possible, just use bold text and lists for clean chat rendering.`;

  // Build the user prompt with chat history
  let prompt = "Chat History:\n";

  // Append history (limit to last 6 messages to save tokens)
  const recentHistory = history.slice(-6);
  recentHistory.forEach(msg => {
    prompt += `${msg.role === 'user' ? 'Student' : 'Coach'}: ${msg.text}\n`;
  });

  prompt += `Student: ${message}\nCoach:`;

  try {
    const answer = await generate(prompt, {
      temperature: 0.7,
      maxOutputTokens: 600,
      systemInstruction,
      label: "study-chat",
    });

    return { answer: answer.trim() };
  } catch (err) {
    console.error("[StudyChat] LLM error:", err.message);
    return {
      answer:
        "I'm having trouble connecting to the AI model right now. Please ensure your GEMINI_API_KEY is properly configured in the environment settings.",
    };
  }
}

module.exports = {
  handleStudyChat,
};
