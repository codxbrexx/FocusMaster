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
const { validate } = require("../middleware/validateMiddleware");
const { authSchemas } = require("../validation/schemas");

router.post("/register", validate({ body: authSchemas.register }), registerUser);
router.post("/login", validate({ body: authSchemas.login }), authUser);
router.post("/guest", validate({ body: authSchemas.guest }), loginGuest);
router.post("/google", validate({ body: authSchemas.google }), googleLogin);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validate({ body: authSchemas.profileUpdate }), updateUserProfile)
  .delete(protect, deleteUserAccount);

router.route("/profile/stats").delete(protect, resetUserStats);

router.post(
  "/otp/send",
  protect,
  validate({ body: authSchemas.otpSend }),
  sendEmailOTP,
);
router.put(
  "/otp/verify",
  protect,
  validate({ body: authSchemas.otpVerify }),
  verifyEmailOTP,
);

module.exports = router;
