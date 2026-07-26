const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { studyProfileBodySchema } = require("../validation/schemas");
const {
  getStudyProfile,
  updateStudyProfile,
} = require("../controllers/studyProfileController");

const router = express.Router();

router.get("/", protect, apiLimiter, getStudyProfile);
router.put(
  "/",
  protect,
  apiLimiter,
  validate({ body: studyProfileBodySchema }),
  updateStudyProfile,
);

module.exports = router;
