const { generate, generateJSON } = require("../llmService");

/**
 * Ask a question based on pre-fetched document chunks.
 */
async function askQuestion(query, chunks) {
  if (!chunks || chunks.length === 0) {
    return {
      answer: "I couldn't find any relevant context in your uploaded notes for this specific query. Upload more documents or try asking about core concepts in your existing materials.",
      context: [],
    };
  }

  const contextText = chunks.map((c, i) => `[Reference Block ${i + 1}]:\n${c.content}`).join("\n\n");
  
  const prompt = `Student Document Excerpts:
${contextText}

Student Question: ${query}`;

  const systemInstruction = `You are a high-level academic assistant analyzing uploaded course materials.
Rules:
- Provide clear, direct, conceptual answers grounded strictly in the provided document excerpts.
- Highlight key definitions, formulas, or takeaways using bold text.
- If the excerpt does not contain the answer, explicitly inform the student while summarizing what related topics ARE covered in the notes.`;

  try {
    const answer = await generate(prompt, {
      temperature: 0.2,
      maxOutputTokens: 600,
      systemInstruction,
      label: "rag-query",
    });
    
    return {
      answer,
      context: chunks.map(c => c.content.substring(0, 120) + "..."),
    };
  } catch (error) {
    console.warn("LLM failed in askQuestion:", error.message);
    const topContext = chunks[0]?.content || "";
    return {
      answer: `Based on your uploaded notes:\n\n${topContext.substring(0, 300)}...\n\n*(Note: GEMINI_API_KEY connection error — displaying excerpt directly).*`,
      context: chunks.map(c => c.content.substring(0, 120) + "..."),
    };
  }
}

/**
 * Generate fallback exam quiz when LLM call fails or returns empty payload.
 */
function generateFallbackQuiz(chunks, topic = "General Study Material") {
  const sampleContent = chunks && chunks[0] ? chunks[0].content : "";
  const firstSentence = sampleContent.split(".")[0] || "core concept";

  return {
    title: `Exam Practice Quiz: ${topic || "Document Review"}`,
    questions: [
      {
        question: `What is the primary focus discussed regarding "${firstSentence.substring(0, 50)}..."?`,
        options: [
          "Understanding key definitions and core principles",
          "Memorizing secondary historical dates only",
          "Ignoring practical problem applications",
          "Relying solely on external intuition"
        ],
        correctAnswerIndex: 0,
        explanation: "Active comprehension of core definitions builds the foundation for solving complex exam questions."
      },
      {
        question: "Which study strategy is most effective when reviewing dense course materials?",
        options: [
          "Passive rereading multiple times",
          "Active recall coupled with timed problem practice",
          "Highlighting entire pages of text",
          "Cramming without taking structured breaks"
        ],
        correctAnswerIndex: 1,
        explanation: "Active recall and timed testing force neural retrieval, drastically boosting exam performance."
      }
    ]
  };
}

/**
 * Generates a multiple-choice quiz from pre-fetched document chunks.
 */
async function generateQuiz(chunks, topic = "") {
  if (!chunks || chunks.length === 0) {
    return {
      error: "Not enough document content to generate a quiz. Upload notes or syllabus documents first."
    };
  }

  const contextText = chunks.slice(0, 4).map(c => c.content).join("\n\n");

  const systemInstruction = `You are a senior exam paper setter creating a rigorous 3-to-5 question diagnostic quiz from student notes.
Rules:
- Questions must test conceptual understanding, key terminology, or numerical/logic skills.
- Provide 4 plausible options for each question.
- Include a clear, educational explanation for why the correct answer is right.`;

  const prompt = `Study Material:
${contextText}

Generate a practice quiz in JSON format matching this exact schema:
{
  "title": "Practice Quiz: ${topic || "Uploaded Material"}",
  "questions": [
    {
      "question": "Clear exam-style question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed explanation of why Option A is correct based on the notes."
    }
  ]
}`;

  try {
    const quiz = await generateJSON(prompt, {
      temperature: 0.3,
      maxOutputTokens: 1600,
      systemInstruction,
      label: "rag-quiz",
    });

    if (quiz && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
      return { quiz };
    }

    const fallback = generateFallbackQuiz(chunks, topic);
    return { quiz: fallback };
  } catch (error) {
    console.warn("[RAG Quiz] LLM failed, returning fallback quiz:", error.message);
    const fallback = generateFallbackQuiz(chunks, topic);
    return { quiz: fallback };
  }
}

module.exports = { askQuestion, generateQuiz, generateFallbackQuiz };
