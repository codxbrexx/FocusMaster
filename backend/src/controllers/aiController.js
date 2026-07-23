const asyncHandler = require("express-async-handler");
const { aggregateUserStats } = require("../services/analytics/aggregator");
const {
  calculateProductivityScore,
} = require("../services/analytics/productivityScore");
const { generateInsights } = require("../services/ai/insightEngine");
const { generateStudyPlan } = require("../services/ai/studyPlanner");
const { getRecommendations } = require("../services/ai/recommender");
const { analyzeFocusDropoff } = require("../services/analytics/focusDropoff");
const { processDocument } = require("../services/ai/documentProcessor");
const { askQuestion, generateQuiz } = require("../services/ai/ragAssistant");
const Document = require("../models/Document");

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

// @desc    Get adaptive timer suggestions based on session history
// @route   GET /api/ai/adaptive-timer
// @access  Private
const getAdaptiveTimer = asyncHandler(async (req, res) => {
  const result = await analyzeFocusDropoff(req.user._id);
  res.json(result);
});

// @desc    Upload document for RAG
// @route   POST /api/ai/documents
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // Expects multer to put file in req.file.buffer
  const result = await processDocument(
    req.file.buffer,
    req.file.originalname,
    req.file.size,
    req.user._id
  );

  res.status(201).json(result);
});

// @desc    Get all user documents
// @route   GET /api/ai/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({ user: req.user._id }).sort({ uploadedAt: -1 });
  res.json({ documents: docs });
});

// @desc    Ask a question based on uploaded documents
// @route   POST /api/ai/rag/query
// @access  Private
const queryRag = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query) {
    res.status(400);
    throw new Error("Query is required");
  }

  const result = await askQuestion(query, req.user._id);
  res.json(result);
});

// @desc    Generate a quiz based on uploaded documents
// @route   POST /api/ai/rag/quiz
// @access  Private
const getQuiz = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  const result = await generateQuiz(topic, req.user._id);
  res.json(result);
});

module.exports = {
  getAnalyticsSummary,
  getInsights,
  getStudyPlan,
  regenerateStudyPlan,
  getRecommendationsHandler,
  getAdaptiveTimer,
  uploadDocument,
  getDocuments,
  queryRag,
  getQuiz,
};


