const express = require('express');
const router = express.Router();
const { createFeedback } = require('../controllers/feedbackController');

const { protect } = require('../middleware/authMiddleware');


router.post('/', async (req, res, next) => {
    
    // Quick "Try Auth" middleware
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
             next();
        } catch (error) {
            next();
        }
    } else {
        next();
    }
}, createFeedback);

module.exports = router;
