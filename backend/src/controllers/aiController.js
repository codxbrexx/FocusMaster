const asyncHandler = require("express-async-handler");
const { addWeeks } = require("date-fns");
const { aggregateUserStats } = require("../services/analytics/aggregator");
const {
  calculateProductivityScore,
} = require("../services/analytics/productivityScore");
const { generateInsights, parseInsightResponse } = require("../services/ai/insightEngine");
const { generateStudyPlan } = require("../services/ai/studyPlanner");
const { getRecommendations } = require("../services/ai/recommender");
const { analyzeFocusDropoff } = require("../services/analytics/focusDropoff");
const { processDocument } = require("../services/ai/documentProcessor");
const { generateEmbedding } = require("../services/ai/vectorSearch");
const { askQuestion, generateQuiz } = require("../services/ai/ragAssistant");
const { handleStudyChat } = require("../services/ai/chatAssistant");

// Models (only the controller touches the database)
const AiInsight = require("../models/AiInsight");
const User = require("../models/User");
const StudyPlan = require("../models/StudyPlan");
const Document = require("../models/Document");
const DocumentChunk = require("../models/DocumentChunk");

const CACHE_HOURS = 24;

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
  const userId = req.user._id;

  // Check cache
  const cached = await AiInsight.findOne({
    user: userId,
    expiresAt: { $gt: new Date() },
  })
    .sort({ generatedAt: -1 })
    .lean();

  if (cached) {
    return res.json({
      insights: cached.insights,
      recommendations: cached.recommendations,
      summary: cached.summary,
      prepAdvice: cached.prepAdvice || "Keep up your preparation!",
      productivityScore: cached.productivityScore,
      scoreBreakdown: cached.scoreBreakdown,
      stats: cached.stats,
      generatedAt: cached.generatedAt,
      fromCache: true,
    });
  }

  // Aggregate + Score
  const stats = await aggregateUserStats(userId, 30);
  const scoreResult = calculateProductivityScore(stats, req.user.settings || {});

  // Call AI service (pure LLM, no DB)
  let parsed;
  try {
    parsed = await generateInsights(stats, scoreResult);
  } catch (err) {
    // LLM failed — try stale cache
    const stale = await AiInsight.findOne({ user: userId })
      .sort({ generatedAt: -1 })
      .lean();

    if (stale) {
      return res.json({
        insights: stale.insights,
        recommendations: stale.recommendations,
        summary: stale.summary,
        prepAdvice: stale.prepAdvice || "Keep up your preparation!",
        productivityScore: scoreResult.score,
        scoreBreakdown: scoreResult.breakdown,
        stats,
        generatedAt: stale.generatedAt,
        fromCache: true,
        stale: true,
      });
    }

    // No cache at all — return fallback
    parsed = parseInsightResponse("invalid");
  }

  // Save to cache
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_HOURS * 60 * 60 * 1000);

  const saved = await AiInsight.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      summary: parsed.summary,
      prepAdvice: parsed.prepAdvice,
      productivityScore: scoreResult.score,
      scoreBreakdown: scoreResult.breakdown,
      stats,
      generatedAt: now,
      expiresAt,
    },
    { upsert: true, new: true },
  );

  res.json({
    insights: saved.insights,
    recommendations: saved.recommendations,
    summary: saved.summary,
    prepAdvice: saved.prepAdvice || parsed.prepAdvice,
    productivityScore: scoreResult.score,
    scoreBreakdown: scoreResult.breakdown,
    stats,
    generatedAt: saved.generatedAt,
    fromCache: false,
  });
});

// @desc    Get or generate AI study plan
// @route   GET /api/ai/study-plan
// @access  Private
const getStudyPlan = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Check for existing plan
  const existing = await StudyPlan.findOne({ user: userId })
    .sort({ generatedAt: -1 })
    .lean();

  if (existing) {
    return res.json({ plan: existing, fromCache: true });
  }

  // Fetch profile and stats, then call AI service
  const user = await User.findById(userId).select("studyProfile settings");
  const profile = user.studyProfile || {};
  const stats = await aggregateUserStats(userId, 30);

  const result = await generateStudyPlan(profile, stats);

  if (result.error) {
    return res.status(result.weeks ? 200 : 400).json({ plan: null, error: result.error });
  }

  // Add dates and save
  const saved = await _saveStudyPlan(userId, result.weeks, profile);
  res.json({ plan: saved, fromCache: false });
});

// @desc    Regenerate AI study plan
// @route   POST /api/ai/study-plan
// @access  Private
const regenerateStudyPlan = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("studyProfile settings");
  const profile = user.studyProfile || {};
  const stats = await aggregateUserStats(userId, 30);

  let result;
  try {
    result = await generateStudyPlan(profile, stats);
  } catch (err) {
    // LLM failed — return existing plan or error
    const fallback = await StudyPlan.findOne({ user: userId })
      .sort({ generatedAt: -1 })
      .lean();

    if (fallback) {
      return res.json({ plan: fallback, fromCache: true, stale: true });
    }
    return res.status(500).json({ plan: null, error: "Failed to generate study plan. Please try again later." });
  }

  if (result.error) {
    return res.status(result.weeks ? 200 : 400).json({ plan: null, error: result.error });
  }

  const saved = await _saveStudyPlan(userId, result.weeks, profile);
  res.json({ plan: saved, fromCache: false });
});

/**
 * Internal helper to date-stamp and persist a study plan.
 */
async function _saveStudyPlan(userId, weeks, profile) {
  const now = new Date();
  const weeksWithDates = weeks.map((week, i) => ({
    ...week,
    weekNumber: i + 1,
    startDate: addWeeks(now, i),
    endDate: addWeeks(now, i + 1),
  }));

  return StudyPlan.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      weeks: weeksWithDates,
      examDate: profile.examDate,
      totalWeeks: weeks.length,
      stream: profile.stream,
      subjects: (profile.subjects || []).map((s) => s.name),
      generatedAt: now,
    },
    { upsert: true, new: true },
  );
}

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

  const userId = req.user._id;

  // 1. Parse PDF and chunk (pure function, no DB)
  const { chunks, pageCount } = await processDocument(req.file.buffer);

  // 2. Create Document record
  const doc = await Document.create({
    user: userId,
    title: req.file.originalname.replace(/\.[^/.]+$/, ""),
    filename: req.file.originalname,
    size: req.file.size,
    pageCount,
  });

  // 3. Generate embeddings and save chunks (batched)
  const batchSize = 10;
  let chunkIndex = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    const chunkDocs = await Promise.all(
      batch.map(async (content) => {
        const embedding = await generateEmbedding(content);
        return {
          document: doc._id,
          user: userId,
          chunkIndex: chunkIndex++,
          content,
          embedding,
        };
      })
    );

    await DocumentChunk.insertMany(chunkDocs);
  }

  res.status(201).json({
    documentId: doc._id,
    title: doc.title,
    chunksProcessed: chunkIndex,
  });
});

// @desc    Get all user documents
// @route   GET /api/ai/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({ user: req.user._id }).sort({ uploadedAt: -1 });
  res.json({ documents: docs });
});

/**
 * Internal helper to perform vector search via MongoDB Atlas.
 */
async function _searchSimilarChunks(query, userId, topK = 5) {
  const queryEmbedding = await generateEmbedding(query);

  try {
    // NOTE: This requires a search index named "vector_index" created in Atlas
    const results = await DocumentChunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
          filter: { user: { $eq: userId } },
        }
      },
      {
        $project: {
          content: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    return results;
  } catch (err) {
    console.error("Atlas Vector Search failed. Is it enabled on this cluster?", err.message);
    return [];
  }
}

// @desc    Ask a question based on uploaded documents
// @route   POST /api/ai/rag/query
// @access  Private
const queryRag = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query) {
    res.status(400);
    throw new Error("Query is required");
  }

  // Fetch chunks from DB, then pass to pure AI function
  const chunks = await _searchSimilarChunks(query, req.user._id, 5);
  const result = await askQuestion(query, chunks);
  res.json(result);
});

// @desc    Generate a quiz based on uploaded documents
// @route   POST /api/ai/rag/quiz
// @access  Private
const getQuiz = asyncHandler(async (req, res) => {
  const { topic } = req.body;

  // Fetch chunks from DB, then pass to pure AI function
  const searchQuery = topic || "key concepts overview summary";
  const chunks = await _searchSimilarChunks(searchQuery, req.user._id, 5);
  const result = await generateQuiz(chunks);
  res.json(result);
});

// @desc    General chat about study preparation and analytics
// @route   POST /api/ai/chat
// @access  Private
const studyChat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  const userId = req.user._id;

  // Fetch all context from DB
  const [stats, user, studyPlan] = await Promise.all([
    aggregateUserStats(userId, 30),
    User.findById(userId).select("studyProfile").lean(),
    StudyPlan.findOne({ user: userId }).sort({ generatedAt: -1 }).lean(),
  ]);

  // Pass structured context to pure AI function
  const contextData = {
    stats,
    studyProfile: user?.studyProfile || null,
    studyPlan,
  };

  const result = await handleStudyChat(message, history || [], contextData);
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
  studyChat,
};
