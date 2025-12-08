const express = require('express');
const asyncHandler = require('express-async-handler');
const { generate } = require('../services/llmService');

const router = express.Router();

// POST /api/llm
router.post('/', asyncHandler(async (req, res) => {
  const { prompt, model, options } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Missing `prompt` in request body');
  }

  const output = await generate(prompt, model, options || {});

  res.json({ text: output });
}));

module.exports = router;
