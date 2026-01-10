const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../../models/User');

const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check Cookie first (standard web app)
    token = req.cookies.jwt;

    // 2. Check Header fallback (mobile/API clients)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId || decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            // Admin Check
            if (req.user.role !== 'admin') {
                res.status(403);
                throw new Error('Access denied. Admin privileges required.');
            }

            next();
        } catch (error) {
            // Distinguish between pure Auth fail vs Admin fail
            if (res.statusCode !== 403) res.status(401);
            throw new Error(error.message || 'Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protectAdmin };
