const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const Task = require('../models/Task');
const { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, format } = require('date-fns');

// @desc    Get daily stats
// @route   GET /api/analytics/today
// @access  Private
const getDailyStats = asyncHandler(async (req, res) => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const sessions = await Session.find({
        user: req.user._id,
        startTime: { $gte: todayStart, $lte: todayEnd },
        type: 'focus'
    });

    const totalDuration = sessions.reduce((acc, curr) => acc + curr.duration, 0); 
    const sessionCount = sessions.length;

    res.json({
        totalDuration,
        sessionCount,
        sessions
    });
});

// @desc    Get weekly stats
// @route   GET /api/analytics/week
// @access  Private
const getWeeklyStats = asyncHandler(async (req, res) => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const sessions = await Session.find({
        user: req.user._id,
        startTime: { $gte: weekStart, $lte: weekEnd },
        type: 'focus'
    });

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const chartData = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const daySessions = sessions.filter(s => format(s.startTime, 'yyyy-MM-dd') === dayStr);
        const duration = daySessions.reduce((acc, curr) => acc + curr.duration, 0);
        return {
            name: format(day, 'EEE'), 
            duration: Math.round(duration / 60), 
            date: dayStr
        };
    });

    res.json(chartData);
});

// @desc    Get task distribution
// @route   GET /api/analytics/distribution
// @access  Private
const getTaskDistribution = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    
    const priorityDist = {
        low: 0,
        medium: 0,
        high: 0
    };

    tasks.forEach(task => {
        if (priorityDist[task.priority] !== undefined) {
             priorityDist[task.priority]++;
        }
    });

    const data = [
        { name: 'High', value: priorityDist.high },
        { name: 'Medium', value: priorityDist.medium },
        { name: 'Low', value: priorityDist.low }
    ];

    res.json(data);
});

// @desc    Get GitHub-style heatmap data
// @route   GET /api/analytics/heatmap
// @access  Private
const getHeatmap = asyncHandler(async (req, res) => {
    const yearStart = subDays(new Date(), 365);
    
    const sessions = await Session.find({
        user: req.user._id,
        startTime: { $gte: yearStart },
        type: 'focus' 
    });

    const map = {};
    sessions.forEach(s => {
        const date = format(s.startTime, 'yyyy-MM-dd');
        if (!map[date]) map[date] = 0;
        map[date] += 1; 
    });

    const data = Object.keys(map).map(date => ({
        date,
        count: map[date]
    }));

    res.json(data);
});

module.exports = {
  getDailyStats,
  getWeeklyStats,
  getTaskDistribution,
  getHeatmap
};
