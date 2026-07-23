const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const {
  getAnalyticsSummary,
  getInsights,
} = require("../controllers/aiController");

const router = express.Router();

// All AI routes require authentication + rate limiting
router.get("/summary", protect, apiLimiter, getAnalyticsSummary);
router.get("/insights", protect, apiLimiter, getInsights);

module.exports = router;
