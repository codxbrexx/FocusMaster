const mongoose = require("mongoose");

const focusRoomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      maxlength: [60, "Room name cannot exceed 60 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot exceed 200 characters"],
      default: "",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maxParticipants: {
      type: Number,
      default: 25,
      min: 2,
      max: 100,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "stream"],
      default: "public",
    },
    stream: {
      type: String,
      enum: ["engineering", "medical", "commerce", "competitive", "custom", null],
      default: null,
    },
    inviteCode: {
      type: String,
      sparse: true,
    },
    timerConfig: {
      focusDuration: { type: Number, default: 25 },
      shortBreakDuration: { type: Number, default: 5 },
      longBreakDuration: { type: Number, default: 15 },
      autoStart: { type: Boolean, default: false },
    },
    ambientPreset: {
      type: String,
      enum: ["none", "lofi", "rain", "binaural", "cafe", "fireplace", "forest"],
      default: "none",
    },
    status: {
      type: String,
      enum: ["waiting", "focusing", "break", "closed"],
      default: "waiting",
      index: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["focusing", "break", "idle", "away"],
          default: "idle",
        },
        isMuted: {
          type: Boolean,
          default: false,
        },
        xpEarned: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalFocusMinutes: {
      type: Number,
      default: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

focusRoomSchema.index({ status: 1, visibility: 1 });
focusRoomSchema.index({ stream: 1, status: 1 });

const FocusRoom = mongoose.model("FocusRoom", focusRoomSchema);

module.exports = FocusRoom;
