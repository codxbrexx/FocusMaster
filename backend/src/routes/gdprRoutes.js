const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const ConsentLog = require('../models/ConsentLog');
const User = require('../models/User');
const Task = require('../models/Task');
const Session = require('../models/Session');
const Feedback = require('../models/Feedback');

// Helper for optional auth
const getUserIdFromToken = (req) => {
  let token = req.cookies.jwt;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
  return null;
};

// POST /api/gdpr/log-consent - Logs user cookie preferences
router.post('/log-consent', asyncHandler(async (req, res) => {
  const { preferences } = req.body;
  const userId = getUserIdFromToken(req);
  
  const consent = new ConsentLog({
    userId: userId || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    preferences,
    timestamp: new Date(),
  });
  
  await consent.save();
  res.status(201).json({ id: consent._id });
}));

// GET /api/gdpr/export - Download user data as JSON
router.get('/export', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const tasks = await Task.find({ userId: req.user._id });
  const sessions = await Session.find({ userId: req.user._id });
  const feedback = await Feedback.find({ userId: req.user._id });
  
  const data = {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    tasks,
    sessions,
    feedback,
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=focusmaster-data.json');
  res.json(data);
}));

// DELETE /api/gdpr/delete - Permanent deletion with cascade
router.delete('/delete', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Cascade delete all related records
  await Promise.all([
    Task.deleteMany({ userId }),
    Session.deleteMany({ userId }),
    Feedback.deleteMany({ userId }),
    User.findByIdAndDelete(userId),
  ]);
  
  // Clear auth cookie
  res.clearCookie('jwt');
  
  res.json({ message: 'Your account and all data has been permanently deleted' });
}));

module.exports = router;
