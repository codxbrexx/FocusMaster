const jwt = require('jsonwebtoken');

const generateToken = (res, userId, req = null) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  let isLocal = false;
  
  if (req) {
      const host = req.get('host') || '';
      const origin = req.get('origin') || '';
      
      if (host.includes('localhost') || host.includes('127.0.0.1') || 
          origin.includes('localhost') || origin.includes('127.0.0.1')) {
          isLocal = true;
      }
  }

  if (process.env.npm_lifecycle_event === 'dev') {
      isLocal = true;
  }

  const secure = process.env.NODE_ENV !== 'development' && !isLocal;
  const sameSite = (process.env.NODE_ENV !== 'development' && !isLocal) ? 'none' : 'lax';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: secure,
    sameSite: sameSite,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;
