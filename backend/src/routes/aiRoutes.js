const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const {
  getAnalyticsSummary,
  getInsights,
  getStudyPlan,
  regenerateStudyPlan,
  getRecommendationsHandler,
} = require("../controllers/aiController");

const router = express.Router();

// All AI routes require authentication + rate limiting
router.get("/summary", protect, apiLimiter, getAnalyticsSummary);
router.get("/insights", protect, apiLimiter, getInsights);
router.get("/study-plan", protect, apiLimiter, getStudyPlan);
router.post("/study-plan", protect, apiLimiter, regenerateStudyPlan);
router.get("/recommendations", protect, apiLimiter, getRecommendationsHandler);

module.exports = router;

