const express = require("express");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const {
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
} = require("../controllers/aiController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// All AI routes require authentication + rate limiting
router.get("/summary", protect, apiLimiter, getAnalyticsSummary);
router.get("/insights", protect, apiLimiter, getInsights);
router.get("/study-plan", protect, apiLimiter, getStudyPlan);
router.post("/study-plan", protect, apiLimiter, regenerateStudyPlan);
router.get("/recommendations", protect, apiLimiter, getRecommendationsHandler);
router.get("/adaptive-timer", protect, apiLimiter, getAdaptiveTimer);

// RAG Routes
router.post("/documents", protect, apiLimiter, upload.single("file"), uploadDocument);
router.get("/documents", protect, apiLimiter, getDocuments);
router.post("/rag/query", protect, apiLimiter, queryRag);
router.post("/rag/quiz", protect, apiLimiter, getQuiz);
router.post("/chat", protect, apiLimiter, studyChat);

module.exports = router;



