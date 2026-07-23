const { searchSimilarChunks } = require("./vectorSearch");
const { generate } = require("../llmService");

/**
 * Ask a question based on uploaded documents.
 * 
 * @param {string} query 
 * @param {string} userId 
 */
async function askQuestion(query, userId) {
  // 1. Retrieve relevant chunks
  const chunks = await searchSimilarChunks(query, userId, 5);
  
  if (!chunks || chunks.length === 0) {
    return {
      answer: "I couldn't find any relevant information in your uploaded notes. Please try rephrasing or upload more documents.",
      context: [],
    };
  }

  // 2. Build context
  const contextText = chunks.map((c, i) => `[Source ${i + 1}]:\n${c.content}`).join("\n\n");
  
  // 3. Build prompt
  const prompt = `You are an intelligent study assistant. Answer the student's question using ONLY the provided context from their notes. 
If the answer is not contained in the context, politely state that you don't know based on the provided notes.

Context:
${contextText}

Question: ${query}

Answer in a clear, educational tone.`;

  // 4. Generate answer
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
 * Generates a multiple-choice quiz from the user's documents.
 * We just get random chunks or chunks related to a topic.
 * 
 * @param {string} topic (Optional topic to focus the quiz on)
 * @param {string} userId 
 */
async function generateQuiz(topic, userId) {
  let chunks = [];
  
  if (topic) {
    chunks = await searchSimilarChunks(topic, userId, 5);
  } else {
    // If no topic, we'd ideally sample random chunks.
    // For simplicity, we search for a broad query or just return an error if we can't do random easily via vector search.
    chunks = await searchSimilarChunks("key concepts overview summary", userId, 5);
  }

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
