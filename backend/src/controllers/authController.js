const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// @desc    Auth user/set token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id, req);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isGuest: user.isGuest,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a guest user
// @route   POST /api/auth/guest
// @access  Public
const loginGuest = asyncHandler(async (req, res) => {
  let user;
  
  if (req.body && req.body.guestId && req.body.guestId.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      user = await User.findById(req.body.guestId);
    } catch (e) {
    }
  }

  // If no user found (or no ID provided), create new one
  if (!user) {
      const guestId = require('crypto').randomBytes(4).toString('hex');
      const name = `Guest ${guestId}`;
      const email = `guest_${guestId}_${Date.now()}@temp.focusmaster`;
      const password = require('crypto').randomBytes(10).toString('hex');

      user = await User.create({
        name,
        email,
        password,
        isGuest: true 
      });
  }

  generateToken(res, user._id, req);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isGuest: user.isGuest
  });
});

// @desc    Login with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = require('crypto').randomBytes(16).toString('hex');
      
      user = await User.create({
        name,
        email,
        password: randomPassword,
        googleId: ticket.getUserId(),
        picture: picture,
      });
    }

    generateToken(res, user._id, req);
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isGuest: user.isGuest,
    });

  } catch (error) {
    res.status(401);
    throw new Error('Google authentication failed: ' + error.message);
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id, req);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User logged out' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
    settings: req.user.settings,
    points: req.user.points,
    badges: req.user.badges,
  };

  res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // Explicitly handle settings update
    if (req.body.settings) {
        const newSettings = { 
            ...(user.settings ? user.settings.toObject() : {}), 
            ...req.body.settings 
        };
        user.settings = newSettings;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      settings: updatedUser.settings,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  loginGuest,
  googleLogin,
};
