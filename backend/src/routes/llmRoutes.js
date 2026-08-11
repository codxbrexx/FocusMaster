const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { generate } = require("../services/llmService");
const { llmBodySchema } = require("../validation/schemas");

const router = express.Router();

// POST /api/llm
// Admin-only raw LLM access — requires valid JWT + admin role, rate-limited, body validated.
// Regular users should use structured AI endpoints (/api/ai/*) instead.
router.post(
  "/",
  protect,
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Admin access required for direct LLM access.");
    }
    next();
  }),
  apiLimiter,
  validate({ body: llmBodySchema }),
  asyncHandler(async (req, res) => {
    const { prompt, model, options } = req.body;

    const output = await generate(prompt, { model, ...(options || {}) });

    res.json({ text: output });
  }),
);

module.exports = router;
