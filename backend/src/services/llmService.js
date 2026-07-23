const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/complete";

async function generate(prompt, model, options = {}) {
  // Use Gemini if configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const chosenModel = model || process.env.DEFAULT_LLM_MODEL || "gemini-1.5-flash";
      const generativeModel = genAI.getGenerativeModel({ model: chosenModel });
      
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (err) {
      console.error("Gemini API failed:", err.message);
      throw new Error(`LLM request failed (Gemini): ${err.message}`);
    }
  }

  // Fallback to Anthropic if configured
  if (process.env.ANTHROPIC_API_KEY) {
    const chosenModel = model || process.env.DEFAULT_LLM_MODEL || "claude-haiku-4.5";
    const max_tokens = options.max_tokens || 512;

    const payload = {
      model: chosenModel,
      prompt,
      max_tokens,
      temperature: options.temperature ?? 0.2,
    };

    const headers = {
      Authorization: `Bearer ${process.env.ANTHROPIC_API_KEY}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.post(ANTHROPIC_ENDPOINT, payload, { headers });

      if (res.data && (res.data.output || res.data.completion || res.data.text)) {
        return res.data.output || res.data.completion || res.data.text;
      }

      return JSON.stringify(res.data);
    } catch (err) {
      const message =
        err.response && err.response.data
          ? JSON.stringify(err.response.data)
          : err.message;
      throw new Error(`LLM request failed (Anthropic): ${message}`);
    }
  }

  throw new Error("No LLM provider configured. Set GEMINI_API_KEY or ANTHROPIC_API_KEY.");
}

module.exports = { generate };
