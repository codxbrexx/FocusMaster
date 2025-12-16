const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const User = require('../models/User');
const { subDays, addMinutes, startOfDay } = require('date-fns');

// @desc    Seed data for heatmap
// @route   POST /api/seed
// @access  Public (for dev)
const seedData = asyncHandler(async (req, res) => {

    let user = await User.findOne({});
    
    if (!user) {
        user = await User.create({
            name: 'Demo User',
            email: 'demo@focusmaster.app',
            password: 'password123',
            isGuest: false
        });
    }

    const sessions = [];
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const date = subDays(today, i);
        
        if (Math.random() > 0.4) {
            const sessionCount = Math.floor(Math.random() * 10) + 1;
            
            for (let j = 0; j < sessionCount; j++) {
                const startTime = addMinutes(startOfDay(date), 480 + (j * 50)); 
                
                sessions.push({
                    user: user._id,
                    type: 'focus',
                    startTime: startTime,
                    duration: 1500, 
                    completed: true,
                    mood: 'focused'
                });
            }
        }
    }

    await Session.insertMany(sessions);
    
    res.json({ 
        message: `Seeded ${sessions.length} sessions for user ${user.name}`,
        user: { email: user.email, password: 'password123' }    
    });
});

module.exports = { seedData };
