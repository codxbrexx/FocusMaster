const asyncHandler = require("express-async-handler");
const WorkLog = require("../models/WorkLog");

// @desc    Clock in
// @route   POST /api/clock/start
// @access  Private
const startClock = asyncHandler(async (req, res) => {
  const activeLog = await WorkLog.findOne({
    user: req.user._id,
    endTime: { $exists: false },
  });
  if (activeLog) {
    res.status(400);
    throw new Error("Already clocked in");
  }

  const log = await WorkLog.create({
    user: req.user._id,
    startTime: new Date(),
  });

  res.status(201).json(log);
});

// @desc    Clock out
// @route   POST /api/clock/stop
// @access  Private
const stopClock = asyncHandler(async (req, res) => {
  const activeLog = await WorkLog.findOne({
    user: req.user._id,
    endTime: { $exists: false },
  });
  if (!activeLog) {
    res.status(400);
    throw new Error("Not clocked in");
  }

  activeLog.endTime = new Date();
  activeLog.duration = (activeLog.endTime - activeLog.startTime) / 1000;
  activeLog.notes = req.body.notes;
  activeLog.breakTime = req.body.breakTime || 0;
  await activeLog.save();

  res.status(200).json(activeLog);
});

// @desc    Get logs
// @route   GET /api/clock/logs
// @access  Private
const getWorkLogs = asyncHandler(async (req, res) => {
  const logs = await WorkLog.find({ user: req.user._id }).sort({
    startTime: -1,
  });
  res.status(200).json(logs);
});

module.exports = {
  startClock,
  stopClock,
  getWorkLogs,
};
