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
const { validate } = require("../middleware/validateMiddleware");
const { spotifyCallbackSchema } = require("../validation/schemas");

router.get("/login", protect, getLoginUrl);
router.post(
  "/callback",
  protect,
  validate({ body: spotifyCallbackSchema }),
  callback,
);
router.get("/player", protect, getPlaybackState);
router.put("/play", protect, play);
router.put("/pause", protect, pause);
router.post("/next", protect, next);
router.post("/prev", protect, previous);

module.exports = router;
