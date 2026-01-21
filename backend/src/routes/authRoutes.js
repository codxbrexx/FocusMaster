const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  loginGuest,
  googleLogin,

  deleteUserAccount,
  resetUserStats,
  sendEmailOTP,
  verifyEmailOTP,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/guest", loginGuest);
router.post("/google", googleLogin);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

router.route("/profile/stats").delete(protect, resetUserStats);

router.post("/otp/send", protect, sendEmailOTP);
router.put("/otp/verify", protect, verifyEmailOTP);

module.exports = router;
