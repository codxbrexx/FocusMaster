const express = require("express");
const asyncHandler = require("express-async-handler");
const rateLimit = require('express-rate-limit');
const { protect } = require("../middleware/authMiddleware");
const { generate } = require("../services/llmService");

const router = express.Router();

// Configuration
const MAX_PROMPT_LENGTH = 10000;
const ALLOWED_MODELS = [
  'claude-instant',
  'claude-2',
  'gpt-4',
];

// Per-user rate limiter for LLM usage
const llmLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 100, 
  keyGenerator: (req) => (req.user && req.user._id ? req.user._id.toString() : req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many LLM requests, please try again later.' });
  },
});

// POST /api/llm
router.post(
  "/",
  protect,
  llmLimiter,
  asyncHandler(async (req, res) => {
    const { prompt, model, options } = req.body;

    if (!prompt) {
      res.status(400);
      throw new Error("Missing `prompt` in request body");
    }

    if (typeof prompt !== 'string' || prompt.length === 0) {
      res.status(400);
      throw new Error('Invalid `prompt` value');
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      res.status(400);
      throw new Error(`Prompt too large. Max ${MAX_PROMPT_LENGTH} characters`);
    }

    if (model && !ALLOWED_MODELS.includes(model)) {
      res.status(400);
      throw new Error('Requested model is not allowed');
    }

    // Call LLM service
    const output = await generate(prompt, model, options || {});

    res.json({ text: output });
  }),
);

module.exports = router;
