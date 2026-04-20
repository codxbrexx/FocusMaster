const express = require("express");
const router = express.Router();
const {
  getLoginUrl,
  callback,
  getPlaybackState,
  play,
  pause,
  next,
  previous,
} = require("../controllers/spotifyController");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { spotifyCallbackSchema } = require("../validation/schemas");

router.get("/login", protect, apiLimiter, getLoginUrl);
router.post(
  "/callback",
  protect,
  apiLimiter,
  validate({ body: spotifyCallbackSchema }),
  callback,
);
router.get("/player", protect, apiLimiter, getPlaybackState);
router.put("/play", protect, apiLimiter, play);
router.put("/pause", protect, apiLimiter, pause);
router.post("/next", protect, apiLimiter, next);
router.post("/prev", protect, apiLimiter, previous);

module.exports = router;
