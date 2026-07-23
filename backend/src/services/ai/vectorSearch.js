const { GoogleGenerativeAI } = require("@google/generative-ai");
const DocumentChunk = require("../../models/DocumentChunk");

// In a real scenario, this would use a proper embedding model.
// Since the llmService currently uses Anthropic or Google, and Anthropic doesn't have a native text-embedding-ada-002 equivalent (except Voyage),
// we will assume Google Generative AI for embeddings if key is present, otherwise return a mock embedding array.

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Generates a vector embedding for a given text.
 * 
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
async function generateEmbedding(text) {
  if (!genAI) {
    // Return mock 768-dimensional vector if no API key
    console.warn("No GEMINI_API_KEY found, using mock embedding.");
    return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Fallback mock
    return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
  }
}

/**
 * Performs a vector search using MongoDB Atlas Vector Search.
 * 
 * @param {string} query 
 * @param {string} userId 
 * @param {number} topK 
 */
async function searchSimilarChunks(query, userId, topK = 5) {
  const queryEmbedding = await generateEmbedding(query);
  
  try {
    // NOTE: This requires a search index named "vector_index" created in Atlas
    const results = await DocumentChunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
          filter: { user: { $eq: userId } },
        }
      },
      {
        $project: {
          content: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);
    
    return results;
  } catch (err) {
    console.error("Atlas Vector Search failed. Is it enabled on this cluster?", err.message);
    
    // Fallback: regular text search if vector search fails
    // We would need a text index on content: { $text: { $search: query } }
    // Just returning an empty array for now since we rely on vector search.
    return [];
  }
}

module.exports = { generateEmbedding, searchSimilarChunks };
