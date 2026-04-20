const express = require("express");
const router = express.Router();
const {
  startClock,
  stopClock,
  getWorkLogs,
} = require("../controllers/workLogController");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { workLogStopSchema } = require("../validation/schemas");

router.post("/start", protect, apiLimiter, startClock);
router.post(
  "/stop",
  protect,
  apiLimiter,
  validate({ body: workLogStopSchema }),
  stopClock,
);
router.get("/logs", protect, apiLimiter, getWorkLogs);

module.exports = router;
