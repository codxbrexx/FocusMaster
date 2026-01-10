const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const Session = require('../../models/Session');
const AuditLog = require('../../models/AuditLog');
const ErrorLog = require('../../models/ErrorLog');
const Feedback = require('../../models/Feedback');

// @desc    Get Dashboard Statistics (KPIs & Traffic)
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. KPIs
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();
    const activeToday = await User.countDocuments({ updatedAt: { $gte: today } }); // Approximation
    const totalErrors = await ErrorLog.countDocuments({ createdAt: { $gte: today } });

    // 2. Traffic Chart (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trafficData = await Session.aggregate([
        { $match: { startTime: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
                sessions: { $sum: 1 },
                uniqueUsers: { $addToSet: "$user" }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                date: "$_id",
                sessions: 1,
                visitors: { $size: "$uniqueUsers" }
            }
        }
    ]);

    res.json({
        kpis: {
            totalUsers,
            totalSessions,
            activeToday,
            recentErrors: totalErrors
        },
        traffic: trafficData
    });
});

// @desc    Get All Users with Pagination & Search
// @route   GET /api/admin/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};

    // Filter by Role or Status if provided
    if (req.query.role) keyword.role = req.query.role;
    if (req.query.status) keyword.status = req.query.status;

    const count = await User.countDocuments({ ...keyword });
    const users = await User.find({ ...keyword })
        .select('-password') // Exclude password
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ users, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Ban or Update User Status
// @route   PUT /api/admin/users/:id/status
// @access  Admin
const updateUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { status, banReason } = req.body;

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot ban another admin');
    }

    const oldStatus = user.status;
    user.status = status;
    if (status === 'banned') {
        user.banReason = banReason;
    }

    await user.save();

    // Audit Log
    await AuditLog.create({
        action: 'USER_STATUS_UPDATE',
        actorId: req.user._id,
        actorName: req.user.name,
        targetId: user._id,
        details: `Changed status from ${oldStatus} to ${status}. Reason: ${banReason || 'N/A'}`
    });

    res.json({ message: `User status updated to ${status}` });
});

// @desc    Get Audit Logs
// @route   GET /api/admin/audit
// @access  Admin
const getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AuditLog.find({})
        .sort({ createdAt: -1 })
        .limit(100); // Hard limit for safety
    res.json(logs);
});

// @desc    Get System Health (Errors & DB Status)
// @route   GET /api/admin/health
// @access  Admin
const getSystemHealth = asyncHandler(async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Recent specific errors
    const errors = await ErrorLog.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('userId', 'name email');

    res.json({
        database: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date(),
        recentErrors: errors
    });
});

// @desc    Get All Feedback/Issues
// @route   GET /api/admin/feedback
// @access  Admin
const getFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.json(feedback);
});

// @desc    Update Feedback Status
// @route   PUT /api/admin/feedback/:id/status
// @access  Admin
const updateFeedbackStatus = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error('Feedback not found');
    }

    feedback.status = req.body.status || 'resolved';
    await feedback.save();

    // Log it
    await AuditLog.create({
        action: 'FEEDBACK_UPDATE',
        actorId: req.user._id,
        actorName: req.user.name,
        targetId: feedback._id,
        details: `Marked feedback as ${feedback.status}`
    });

    res.json(feedback);
});

module.exports = {
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getAuditLogs,
    getSystemHealth,
    getFeedback,
    updateFeedbackStatus
};
