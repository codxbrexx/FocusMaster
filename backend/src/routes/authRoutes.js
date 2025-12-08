const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  loginGuest,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/guest', loginGuest);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
