const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const User = require('../models/User');
const { subDays, addMinutes, startOfDay } = require('date-fns');

// @desc    Seed data for heatmap
// @route   POST /api/seed
// @access  Public (for dev)
const seedData = asyncHandler(async (req, res) => {
    // Find a user
    let user = await User.findOne({});
    
    // If no user, create a default 'Guest' or 'Dev' user if permitted, 
    // but better to assuming the user just registered.
    if (!user) {
        // Try creating a demo user
        user = await User.create({
            name: 'Demo User',
            email: 'demo@focusmaster.app',
            password: 'password123',
            isGuest: false
        });
    }

    const sessions = [];
    const today = new Date();

    // Generate scatter data for the last 365 days
    for (let i = 0; i < 365; i++) {
        const date = subDays(today, i);
        
        // Random chance to have sessions on this day (60% chance)
        if (Math.random() > 0.4) {
            // Random number of sessions (1 to 10 for more variation)
            const sessionCount = Math.floor(Math.random() * 10) + 1;
            
            for (let j = 0; j < sessionCount; j++) {
                // Skew towards focus sessions
                const startTime = addMinutes(startOfDay(date), 480 + (j * 50)); 
                
                sessions.push({
                    user: user._id,
                    type: 'focus',
                    startTime: startTime,
                    duration: 1500, // 25 mins
                    completed: true,
                    mood: 'focused'
                });
            }
        }
    }

    await Session.insertMany(sessions);
    
    res.json({ 
        message: `Seeded ${sessions.length} sessions for user ${user.name}`,
        user: { email: user.email, password: 'password123' } // Info to login if needed
    });
});

module.exports = { seedData };
