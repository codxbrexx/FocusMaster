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
const {
  apiLimiter,
  authLimiter,
} = require("../middleware/rateLimitMiddleware");
const { sanitizeBody } = require("../middleware/sanitizeMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { authSchemas } = require("../validation/schemas");

router.post(
  "/register",
  authLimiter,
  sanitizeBody(["password"]),
  validate({ body: authSchemas.register }),
  registerUser,
);
router.post(
  "/login",
  authLimiter,
  sanitizeBody(["password"]),
  validate({ body: authSchemas.login }),
  authUser,
);
router.post("/guest", authLimiter, validate({ body: authSchemas.guest }), loginGuest);
router.post(
  "/google",
  authLimiter,
  sanitizeBody(["token"]),
  validate({ body: authSchemas.google }),
  googleLogin,
);
router.post("/logout", apiLimiter, logoutUser);
router
  .route("/profile")
  .get(protect, apiLimiter, getUserProfile)
  .put(
    protect,
    apiLimiter,
    sanitizeBody(["password"]),
    validate({ body: authSchemas.profileUpdate }),
    updateUserProfile,
  )
  .delete(protect, apiLimiter, deleteUserAccount);

router.route("/profile/stats").delete(protect, apiLimiter, resetUserStats);

router.post(
  "/otp/send",
  protect,
  apiLimiter,
  sanitizeBody(),
  validate({ body: authSchemas.otpSend }),
  sendEmailOTP,
);
router.put(
  "/otp/verify",
  protect,
  apiLimiter,
  sanitizeBody(["otp"]),
  validate({ body: authSchemas.otpVerify }),
  verifyEmailOTP,
);

module.exports = router;
