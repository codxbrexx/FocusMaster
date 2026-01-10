const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuth');
const {
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getAuditLogs,
    getSystemHealth,
    getFeedback,
    updateFeedbackStatus
} = require('../controllers/adminController');

// All routes are protected by adminAuth
router.use(protectAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/audit', getAuditLogs);
router.get('/health', getSystemHealth);
router.get('/feedback', getFeedback);
router.put('/feedback/:id/status', updateFeedbackStatus);

module.exports = router;
