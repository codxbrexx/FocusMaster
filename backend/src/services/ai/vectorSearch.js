const { generateEmbedding: llmGenerateEmbedding } = require("../llmService");

/**
 * Generates a vector embedding for a given text.
 *
 * This is the only function in this module. The actual vector search
 * ($vectorSearch aggregation) is handled by the controller, which owns
 * all database access.
 * 
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
async function generateEmbedding(text) {
  if (!process.env.GEMINI_API_KEY) {
    // Return mock 768-dimensional vector if no API key
    console.warn("No GEMINI_API_KEY found, using mock embedding.");
    return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
  }

  try {
    // Uses llmService which inherently uses the @google/genai SDK
    return await llmGenerateEmbedding(text);
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Fallback mock
    return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
  }
}

module.exports = { generateEmbedding };
