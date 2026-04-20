const express = require("express");
const router = express.Router();
const { createFeedback } = require("../controllers/feedbackController");
const { validate } = require("../middleware/validateMiddleware");
const { feedbackBodySchema } = require("../validation/schemas");

const { protect } = require("../middleware/authMiddleware");

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
  validate({ body: feedbackBodySchema }),
  createFeedback,
);

module.exports = router;
