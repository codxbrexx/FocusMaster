const express = require('express');
const router = express.Router();

// POST /api/feedback
router.post('/', (req, res) => {
  try {
    const { message, email, category } = req.body;

    // Basic validation
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Here you could:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log to file
    // For now, just log to console
    console.log('Feedback received:', { message, email, category, timestamp: new Date() });

    res.status(200).json({ success: true, message: 'Feedback received successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
