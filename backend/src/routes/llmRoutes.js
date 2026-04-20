const express = require("express");
const asyncHandler = require("express-async-handler");
const { generate } = require("../services/llmService");
const { validate } = require("../middleware/validateMiddleware");
const { llmBodySchema } = require("../validation/schemas");

const router = express.Router();

// POST /api/llm
router.post(
  "/",
  validate({ body: llmBodySchema }),
  asyncHandler(async (req, res) => {
    const { prompt, model, options } = req.body;

    const output = await generate(prompt, model, options || {});

    res.json({ text: output });
  }),
);

module.exports = router;
