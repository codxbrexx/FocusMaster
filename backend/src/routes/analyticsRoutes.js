const express = require("express");
const router = express.Router();
const {
  getDailyStats,
  getWeeklyStats,
  getTaskDistribution,
  getHeatmap,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/today", protect, getDailyStats);
router.get("/week", protect, getWeeklyStats);
router.get("/distribution", protect, getTaskDistribution);
router.get("/heatmap", protect, getHeatmap);

module.exports = router;
