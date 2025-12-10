const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict', // Must be 'none' to enable cross-site delivery
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;
