const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const User = require('../models/User');
const Task = require('../models/Task');

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

  if (type === 'focus') {
      const user = await User.findById(req.user._id);
      user.points += 10;
      await user.save();
      if (task) {
          const taskDoc = await Task.findById(task);
          if (taskDoc) {
              taskDoc.completedPomodoros += 1;
              await taskDoc.save();
          }
      }
  }

  res.status(201).json(session);
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
        if (range === 'today') {
            startDate.setHours(0,0,0,0);
        } else if (range === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (range === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        }
        query.startTime = { $gte: startDate };
    }

  const sessions = await Session.find(query)
    .populate('task', 'title')
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

    sessions.forEach(s => {
        if (s.type === 'focus') {
            totalFocusTime += s.duration;
            totalSessions += 1;
        }
    });

  res.status(200).json({
      totalFocusTime,
      totalSessions
  });
});

module.exports = {
  createSession,
  getSessions,
  getSessionStats,
};
