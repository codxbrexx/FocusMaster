const { generate } = require("../llmService");

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
  const prompt = `You are an intelligent study assistant. Answer the student's question using ONLY the provided context from their notes. 
If the answer is not contained in the context, politely state that you don't know based on the provided notes.

Context:
${contextText}

Question: ${query}

Answer in a clear, educational tone.`;

  // Generate answer
  try {
    const answer = await generate(prompt, null, {
      temperature: 0.2, // Low temp for factual answers
      max_tokens: 500,
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
  
  const prompt = `You are a strict teacher. Based on the following study notes, generate a 5-question multiple choice quiz.
Each question must have exactly 4 options and 1 correct answer.
Return the result strictly as a JSON object matching this schema (no markdown fences):
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
}

Study Notes:
${contextText}`;

  try {
    let response = await generate(prompt, null, {
      temperature: 0.3,
      max_tokens: 1500,
    });
    
    let cleaned = response.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    const quiz = JSON.parse(cleaned);
    return { quiz };
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return { error: "Failed to generate quiz. Please try again." };
  }
}

module.exports = { askQuestion, generateQuiz };
