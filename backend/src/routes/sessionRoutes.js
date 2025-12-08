const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionStats,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSessions).post(protect, createSession);
router.get('/stats', protect, getSessionStats);

module.exports = router;
