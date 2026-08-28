const express = require("express");
const router = express.Router();
const {
  getXpSummary,
  getBadges,
  toggleStreakShield,
} = require("../controllers/xpController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getXpSummary);
router.get("/badges", protect, getBadges);
router.post("/streak-shield", protect, toggleStreakShield);

module.exports = router;
