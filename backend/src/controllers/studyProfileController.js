const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get current user's study profile
// @route   GET /api/study-profile
// @access  Private
const getStudyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("studyProfile");

  res.json({
    studyProfile: user.studyProfile || {
      stream: null,
      customStreamName: "",
      subjects: [],
      examDate: null,
      weeklyGoalHours: 20,
      availableHoursPerDay: 4,
    },
  });
});

// @desc    Update current user's study profile
// @route   PUT /api/study-profile
// @access  Private
const updateStudyProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "stream",
    "customStreamName",
    "subjects",
    "examDate",
    "weeklyGoalHours",
    "availableHoursPerDay",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[`studyProfile.${field}`] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true },
  ).select("studyProfile");

  res.json({ studyProfile: user.studyProfile });
});

module.exports = { getStudyProfile, updateStudyProfile };
