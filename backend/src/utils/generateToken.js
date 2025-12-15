const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    // If running via 'npm run dev', we are local, so we must allow non-secure cookies (http) even if NODE_ENV is production.
    secure: process.env.NODE_ENV !== 'development' && process.env.npm_lifecycle_event !== 'dev', 
    sameSite: process.env.NODE_ENV !== 'development' && process.env.npm_lifecycle_event !== 'dev' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;
