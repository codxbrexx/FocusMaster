const leaderboardService = require("../services/leaderboardService");

/**
 * GET /api/leaderboard
 * Query params: period (weekly | monthly | alltime), stream (global | engineering | medical | commerce | competitive)
 */
const getLeaderboard = async (req, res) => {
  try {
    const { period = "weekly", stream = "global", limit = 50 } = req.query;
    const currentUserId = req.user?._id;

    const data = await leaderboardService.getLeaderboard({
      period,
      stream,
      limit: parseInt(limit, 10) || 50,
      currentUserId,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch leaderboard",
    });
  }
};

/**
 * GET /api/leaderboard/user
 * Fetch user's rank across periods and streams
 */
const getUserRank = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const [weeklyGlobal, monthlyGlobal, weeklyStream] = await Promise.all([
      leaderboardService.getLeaderboard({ period: "weekly", stream: "global", currentUserId }),
      leaderboardService.getLeaderboard({ period: "monthly", stream: "global", currentUserId }),
      leaderboardService.getLeaderboard({ period: "weekly", stream: req.user.stream || req.user.studyStream || "engineering", currentUserId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        weeklyGlobal: weeklyGlobal.userRank,
        monthlyGlobal: monthlyGlobal.userRank,
        weeklyStream: weeklyStream.userRank,
        stream: req.user.stream || req.user.studyStream || "engineering",
      },
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user rank",
    });
  }
};

module.exports = {
  getLeaderboard,
  getUserRank,
};
