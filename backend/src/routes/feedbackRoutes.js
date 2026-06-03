const express = require("express");
const router = express.Router();
const { createFeedback } = require("../controllers/feedbackController");
const { validate } = require("../middleware/validateMiddleware");
const { feedbackBodySchema } = require("../validation/schemas");
const { sanitizeBody } = require("../middleware/sanitizeMiddleware");

const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");

router.post(
  "/",
  async (req, res, next) => {
    // Quick "Try Auth" middleware
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        next();
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  },
  apiLimiter,
  sanitizeBody(),
  validate({ body: feedbackBodySchema }),
  createFeedback,
);

module.exports = router;
