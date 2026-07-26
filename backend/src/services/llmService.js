/**
 * LLM Service — Professional Gemini API Integration
 *
 * Features:
 *   • @google/genai SDK (GA, replaces deprecated @google/generative-ai)
 *   • Singleton client — one instance for the app lifecycle
 *   • JSON mode — `responseMimeType: "application/json"` for structured outputs
 *   • System instructions — separated from user prompts (lower token cost)
 *   • Safety settings — prevents unnecessary content blocks for educational content
 *   • Retry with exponential backoff — handles 429 / 503 gracefully
 *   • Token usage logging — cost visibility per request
 *   • Embedding support — shared client for embedding calls
 */

const { GoogleGenAI } = require("@google/genai");

// Singleton Client
let _client = null;

function getClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Add it to your .env file.",
      );
    }
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

// Default Configuration
const DEFAULT_MODEL = process.env.DEFAULT_LLM_MODEL || "gemini-2.0-flash";
const DEFAULT_EMBEDDING_MODEL = process.env.DEFAULT_EMBEDDING_MODEL || "gemini-embedding-001";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// Safety settings — tuned for educational/productivity content
const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
];

// Retry Helper
async function withRetry(fn, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable =
        err.status === 429 ||
        err.status === 503 ||
        err.message?.includes("RESOURCE_EXHAUSTED") ||
        err.message?.includes("UNAVAILABLE");

      if (!isRetryable || attempt === retries) {
        throw err;
      }

      const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500;
      console.warn(
        `[LLM] Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${retries}) — ${err.message}`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// Token Usage Logger
function logUsage(label, response) {
  const usage = response?.usageMetadata;
  if (usage) {
    console.log(
      `[LLM:${label}] Tokens — prompt: ${usage.promptTokenCount ?? "?"}, ` +
      `completion: ${usage.candidatesTokenCount ?? "?"}, ` +
      `total: ${usage.totalTokenCount ?? "?"}`,
    );
  }
}

// Generate (Text Output)
/**
 * Generate text from a prompt.
 *
 * @param {string} prompt
 * @param {Object} [options] 
 * @param {string} [options.model]            
 * @param {string} [options.systemInstruction] 
 * @param {number} [options.maxOutputTokens]
 * @param {number} [options.temperature]
 * @param {string} [options.label]
 * @returns {Promise<string>}
 */
async function generate(prompt, options = {}) {
  const client = getClient();
  const model = options.model || DEFAULT_MODEL;

  const config = {
    maxOutputTokens: options.maxOutputTokens || options.max_tokens || 512,
    temperature: options.temperature ?? 0.4,
    safetySettings: SAFETY_SETTINGS,
  };

  if (options.systemInstruction) {
    config.systemInstruction = options.systemInstruction;
  }

  return withRetry(async () => {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    logUsage(options.label || model, response);
    return response.text;
  });
}

// Generate JSON (Structured Output)
/**
 * Generate structured JSON from a prompt.
 * Uses Gemini's native JSON mode — guarantees valid JSON output,
 * eliminating the need for "no markdown fences" hacks and fragile parsing.
 *
 * @param {string} prompt          - User/data prompt
 * @param {Object} [options]       - Generation options (same as generate)
 * @returns {Promise<Object>} Parsed JSON object
 */
async function generateJSON(prompt, options = {}) {
  const client = getClient();
  const model = options.model || DEFAULT_MODEL;

  const config = {
    maxOutputTokens: options.maxOutputTokens || options.max_tokens || 512,
    temperature: options.temperature ?? 0.3,
    responseMimeType: "application/json",
    safetySettings: SAFETY_SETTINGS,
  };

  if (options.systemInstruction) {
    config.systemInstruction = options.systemInstruction;
  }

  return withRetry(async () => {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    logUsage(options.label || `${model}:json`, response);

    const text = response.text;

    try {
      return JSON.parse(text);
    } catch {
      // Shouldn't happen with JSON mode, but safety net
      console.error("[LLM] JSON mode returned unparseable text:", text?.substring(0, 200));
      throw new Error("LLM returned invalid JSON despite JSON mode.");
    }
  });
}

// Generate Embedding
/**
 * Generate a vector embedding for text.
 *
 * @param {string} text - Text to embed
 * @param {string} [model] - Embedding model name override
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(text, model) {
  const client = getClient();
  const embeddingModel = model || DEFAULT_EMBEDDING_MODEL;

  return withRetry(async () => {
    const response = await client.models.embedContent({
      model: embeddingModel,
      contents: text,
    });
    return response.embeddings[0].values;
  });
}

module.exports = { generate, generateJSON, generateEmbedding, getClient };
