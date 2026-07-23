const asyncHandler = require("express-async-handler");
const { aggregateUserStats } = require("../services/analytics/aggregator");
const {
  calculateProductivityScore,
} = require("../services/analytics/productivityScore");
const { generateInsights } = require("../services/ai/insightEngine");
const { generateStudyPlan } = require("../services/ai/studyPlanner");
const { getRecommendations } = require("../services/ai/recommender");

// @desc    Get aggregated analytics summary + productivity score
// @route   GET /api/ai/summary
// @access  Private
const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const stats = await aggregateUserStats(req.user._id, days);
  const score = calculateProductivityScore(stats, req.user.settings || {});

  res.json({
    stats,
    productivityScore: score.score,
    scoreBreakdown: score.breakdown,
  });
});

// @desc    Get AI-generated insights (cached 24h)
// @route   GET /api/ai/insights
// @access  Private
const getInsights = asyncHandler(async (req, res) => {
  const result = await generateInsights(req.user._id, req.user.settings || {});
  res.json(result);
});

// @desc    Get or generate AI study plan
// @route   GET /api/ai/study-plan
// @access  Private
const getStudyPlan = asyncHandler(async (req, res) => {
  const result = await generateStudyPlan(req.user._id, false);

  if (result.error) {
    res.status(result.plan ? 200 : 400).json(result);
    return;
  }

  res.json(result);
});

// @desc    Regenerate AI study plan
// @route   POST /api/ai/study-plan
// @access  Private
const regenerateStudyPlan = asyncHandler(async (req, res) => {
  const result = await generateStudyPlan(req.user._id, true);

  if (result.error) {
    res.status(result.plan ? 200 : 400).json(result);
    return;
  }

  res.json(result);
});

// @desc    Get rule-based recommendations (no LLM)
// @route   GET /api/ai/recommendations
// @access  Private
const getRecommendationsHandler = asyncHandler(async (req, res) => {
  const stats = await aggregateUserStats(req.user._id, 30);
  const result = getRecommendations(stats, req.user.settings || {});
  res.json(result);
});

module.exports = {
  getAnalyticsSummary,
  getInsights,
  getStudyPlan,
  regenerateStudyPlan,
  getRecommendationsHandler,
};

