const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');

// @desc    Create a new feedback/bug report
// @route   POST /api/feedback
// @access  Public (or Private)
const createFeedback = asyncHandler(async (req, res) => {
  const { message, email, category, deviceInfo } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  const feedbackData = {
    message,
    category: category || 'other',
    deviceInfo
  };

  if (req.user) {
    feedbackData.user = req.user._id;
    feedbackData.email = email || req.user.email;
  } else {
    feedbackData.email = email;
  }

  const feedback = await Feedback.create(feedbackData);

  res.status(201).json({
    success: true,
    data: feedback,
    message: 'Feedback submitted successfully',
  });
});

module.exports = {
  createFeedback,
};
