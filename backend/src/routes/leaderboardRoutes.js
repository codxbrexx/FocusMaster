const express = require("express");
const router = express.Router();
const { getLeaderboard, getUserRank } = require("../controllers/leaderboardController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

// GET /api/leaderboard?period=weekly&stream=engineering
router.get("/", optionalAuth, getLeaderboard);

// GET /api/leaderboard/user
router.get("/user", protect, getUserRank);

module.exports = router;
