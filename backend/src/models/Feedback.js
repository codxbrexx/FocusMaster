const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["bug", "feature", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      screenSize: String,
    },
  },
  {
    timestamps: true,
  },
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
