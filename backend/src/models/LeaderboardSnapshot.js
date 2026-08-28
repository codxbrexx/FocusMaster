const mongoose = require("mongoose");

const leaderboardSnapshotSchema = mongoose.Schema({
  period: {
    type: String,
    enum: ["weekly", "monthly", "alltime"],
    required: true,
  },
  stream: {
    type: String,
    default: "global",
  },
  weekOf: {
    type: Date,
    required: true,
  },
  rankings: [
    {
      rank: { type: Number },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: { type: String },
      avatar: { type: String },
      xp: { type: Number },
      level: { type: Number },
      streak: { type: Number },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 90 * 24 * 60 * 60, // 90 days TTL
  },
});

const LeaderboardSnapshot = mongoose.model(
  "LeaderboardSnapshot",
  leaderboardSnapshotSchema,
);

module.exports = LeaderboardSnapshot;
