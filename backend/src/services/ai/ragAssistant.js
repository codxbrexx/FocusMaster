const { generate, generateJSON } = require("../llmService");

/**
 * Ask a question based on pre-fetched document chunks.
 *
 * This function is a pure data-transformation layer. It does NOT access
 * the database. The caller (controller) performs the vector search and
 * passes the relevant chunks in.
 *
 * @param {string} query
 * @param {Array<{ content: string }>} chunks
 * @returns {Promise<Object>}
 */
async function askQuestion(query, chunks) {
  if (!chunks || chunks.length === 0) {
    return {
      answer: "I couldn't find any relevant information in your uploaded notes. Please try rephrasing or upload more documents.",
      context: [],
    };
  }

  // Build context
  const contextText = chunks.map((c, i) => `[Source ${i + 1}]:\n${c.content}`).join("\n\n");
  
  // Build prompt
  const prompt = `Context from student's notes:
${contextText}

Question: ${query}`;

  const systemInstruction = `You are an intelligent study assistant. Answer the student's question using ONLY the provided context from their notes.
If the answer is not contained in the context, politely state that you don't know based on the provided notes.
Answer in a clear, educational tone.`;

  // Generate answer
  try {
    const answer = await generate(prompt, {
      temperature: 0.2, // Low temp for factual answers
      maxOutputTokens: 500,
      systemInstruction,
      label: "rag-query",
    });
    
    return {
      answer,
      context: chunks.map(c => c.content.substring(0, 100) + "..."),
    };
  } catch (error) {
    console.error("LLM failed in askQuestion:", error);
    return {
      error: "Failed to generate an answer. Please try again later."
    };
  }
}

/**
 * Generates a multiple-choice quiz from pre-fetched document chunks.
 *
 * This function is a pure data-transformation layer. It does NOT access
 * the database. The caller (controller) performs the vector search and
 * passes the relevant chunks in.
 *
 * @param {Array<{ content: string }>} chunks - Pre-fetched relevant chunks
 * @returns {Promise<Object>}
 */
async function generateQuiz(chunks) {
  if (!chunks || chunks.length === 0) {
    return {
      error: "Not enough document content to generate a quiz. Upload notes first."
    };
  }

  const contextText = chunks.map(c => c.content).join("\n\n");

  const systemInstruction = `You are a strict teacher. Generate a 5-question multiple choice quiz based on the provided study notes.
Each question must have exactly 4 options and 1 correct answer.`;

  const prompt = `Study Notes:
${contextText}

Generate a quiz with this exact JSON structure:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`;

  try {
    const quiz = await generateJSON(prompt, {
      temperature: 0.3,
      maxOutputTokens: 1500,
      systemInstruction,
      label: "rag-quiz",
    });

    return { quiz };
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return { error: "Failed to generate quiz. Please try again." };
  }
}

module.exports = { askQuestion, generateQuiz };
