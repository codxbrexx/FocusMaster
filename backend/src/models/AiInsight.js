const mongoose = require("mongoose");

const aiInsightSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  insights: {
    type: [String],
    default: [],
  },
  recommendations: {
    type: [String],
    default: [],
  },
  summary: {
    type: String,
    default: "",
  },
  prepAdvice: {
    type: String,
    default: "",
  },
  productivityScore: {
    type: Number,
    default: 0,
  },
  scoreBreakdown: {
    type: Object,
    default: {},
  },
  stats: {
    type: Object,
    default: {},
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index — MongoDB auto-deletes when expiresAt passes
  },
});

const AiInsight = mongoose.model("AiInsight", aiInsightSchema);

module.exports = AiInsight;
