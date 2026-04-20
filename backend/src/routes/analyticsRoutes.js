const express = require("express");
const router = express.Router();
const {
  getDailyStats,
  getWeeklyStats,
  getTaskDistribution,
  getHeatmap,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");

router.get("/today", protect, apiLimiter, getDailyStats);
router.get("/week", protect, apiLimiter, getWeeklyStats);
router.get("/distribution", protect, apiLimiter, getTaskDistribution);
router.get("/heatmap", protect, apiLimiter, getHeatmap);

module.exports = router;
