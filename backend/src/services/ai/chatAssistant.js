const { generate } = require("../llmService");

/**
 * Handle a general study chat query from the user, providing LLM with context
 * about their study profile, plan, and recent focus stats.
 *
 * @param {string} message
 * @param {Array<{role: string, text: string}>} history 
 * @param {Object} contextData   
 */
async function handleStudyChat(message, history = [], contextData = {}) {
  const { stats, studyProfile, studyPlan } = contextData;

  const stream = studyProfile?.stream || studyProfile?.customStreamName || "General Academic";
  const subjects = (studyProfile?.subjects || []).map(s => typeof s === "object" ? s.name : s).join(", ");

  let contextStr = `Student Context:\n`;
  contextStr += `- Stream/Exam Target: ${stream}\n`;
  contextStr += `- Core Subjects: ${subjects || "General topics"}\n`;

  if (studyProfile?.examDate) {
    const daysLeft = Math.ceil((new Date(studyProfile.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    contextStr += `- Target Exam Date: ${new Date(studyProfile.examDate).toLocaleDateString()} (${daysLeft} days remaining)\n`;
  }

  if (stats) {
    contextStr += `- Focus Performance (30 Days): ${stats.focus?.totalSessions || 0} sessions completed, ${Math.round((stats.focus?.totalMinutes || 0)/60)} total hours focused.\n`;
    contextStr += `- Completion Rate: ${Math.round(stats.tasks?.completionRate || 0)}%\n`;
    contextStr += `- Active Streak: ${stats.patterns?.currentStreak || 0} days\n`;
  }

  if (studyPlan?.weeks && studyPlan.weeks.length > 0) {
    const currentWeek = studyPlan.weeks[0];
    contextStr += `- Active Study Plan Phase: Week ${currentWeek.weekNumber} ("${currentWeek.theme}")\n`;
  }

  const systemInstruction = `You are an elite, highly experienced Senior Academic Mentor and Exam Strategist.
You coach students targeting top performance in exams like JEE, NEET, GATE, UPSC, CA, Engineering, and Medical.

Tone & Persona:
- Professional, sharp, practical, and deeply encouraging without fake hype.
- Never sound generic or like a robotic AI chatbot.
- Speak directly to the student's stream (${stream}) and subjects (${subjects || "their courses"}).
- Provide clear, step-by-step advice with bold text and clean bullet points.
- Focus on practical learning methods: active recall, spaced repetition, problem breakdown, and focus stamina.

${contextStr}`;

  let prompt = "Conversation History:\n";
  const recentHistory = history.slice(-6);
  recentHistory.forEach((msg) => {
    prompt += `${msg.role === "user" ? "Student" : "Mentor"}: ${msg.text}\n`;
  });

  prompt += `Student: ${message}\nMentor:`;

  try {
    const answer = await generate(prompt, {
      temperature: 0.6,
      maxOutputTokens: 700,
      systemInstruction,
      label: "study-chat",
    });

    return { answer: answer.trim() };
  } catch (err) {
    console.warn("[StudyChat] LLM fallback active:", err.message);

    // Provide intelligent offline stream-aware response
    const offlineAdvice = `Here is a practical recommendation for **${stream}**:

1. **Active Recall & Core Sprints**: Break your study session into 30-45 minute blocks dedicated strictly to **${subjects || "your core subjects"}**.
2. **Review Strategy**: Write down key concepts from memory before opening your notes to strengthen memory retention.
3. **Pacing**: Maintain a steady daily streak to protect your study momentum as your exam date approaches.

*(Note: Connect your GEMINI_API_KEY for dynamic real-time AI Q&A).*`;

    return { answer: offlineAdvice };
  }
}

module.exports = {
  handleStudyChat,
};
