const asyncHandler = require("express-async-handler");
const Session = require("../models/Session");
const User = require("../models/User");
const Task = require("../models/Task");
const { awardXP } = require("../services/xpService");

// @desc    Log a completed session
// @route   POST /api/sessions
// @access  Private
const createSession = asyncHandler(async (req, res) => {
  const { task, type, startTime, endTime, duration, mood } = req.body;

  const session = await Session.create({
    user: req.user._id,
    task,
    type,
    startTime,
    endTime,
    duration,
    mood,
  });

  let xpResult = null;

  if (type === "focus") {
    // Calculate session total pomodoros for badges
    const userSessions = await Session.countDocuments({ user: req.user._id, type: "focus" });
    xpResult = await awardXP(req.user._id, 10, "solo_focus_session", {
      totalPomodoroCount: userSessions,
      dailyFocusMinutes: (duration || 25),
    });

    if (task) {
      const taskDoc = await Task.findById(task);
      if (taskDoc) {
        taskDoc.completedPomodoros += 1;
        await taskDoc.save();
      }
    }
  }

  res.status(201).json({
    ...session.toObject(),
    xpEarned: xpResult ? xpResult.xpEarned : 0,
    totalXP: xpResult ? xpResult.totalXP : 0,
    level: xpResult ? xpResult.level : 1,
    leveledUp: xpResult ? xpResult.leveledUp : false,
    newlyEarnedBadges: xpResult ? xpResult.newlyEarnedBadges : [],
  });
});

// @desc    Get user sessions
// @route   GET /api/sessions
// @access  Private
const getSessions = asyncHandler(async (req, res) => {
  const { range } = req.query;
  let query = { user: req.user._id };

  if (range) {
    const now = new Date();
    let startDate = new Date();
    if (range === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "month") {
      startDate.setMonth(now.getMonth() - 1);
    }
    query.startTime = { $gte: startDate };
  }

  const sessions = await Session.find(query)
    .populate("task", "title")
    .sort({ startTime: -1 });

  res.status(200).json(sessions);
});

// @desc    Get session stats
// @route   GET /api/sessions/stats
// @access  Private
const getSessionStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const sessions = await Session.find({ user: userId });

  let totalFocusTime = 0;
  let totalSessions = 0;

  sessions.forEach((s) => {
    if (s.type === "focus") {
      totalFocusTime += s.duration;
      totalSessions += 1;
    }
  });

  res.status(200).json({
    totalFocusTime,
    totalSessions,
  });
});

// @desc    Get a single session
// @route   GET /api/sessions/:id
// @access  Private
const getSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id).populate(
    "task",
    "title",
  );

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  // Ensure user owns this session
  if (session.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this session");
  }

  res.status(200).json(session);
});

// @desc    Update a session
// @route   PATCH /api/sessions/:id
// @access  Private
const updateSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  // Ensure user owns this session
  if (session.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this session");
  }

  // Update allowed fields
  const allowedUpdates = ["mood", "endTime", "duration", "task"];
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      session[key] = req.body[key];
    }
  });

  const updatedSession = await session.save();
  res.status(200).json(updatedSession);
});

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  // Ensure user owns this session
  if (session.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this session");
  }

  await session.deleteOne();
  res.status(200).json({ message: "Session deleted successfully" });
});

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getSessionStats,
};
