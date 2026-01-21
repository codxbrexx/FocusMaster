const axios = require("axios");

const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/complete";

async function generate(prompt, model, options = {}) {
  const chosenModel =
    model || process.env.DEFAULT_LLM_MODEL || "claude-haiku-4.5";

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "No LLM provider configured. Set ANTHROPIC_API_KEY to enable Claude requests.",
    );
  }

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
    throw new Error(`LLM request failed: ${message}`);
  }
}

module.exports = { generate };
