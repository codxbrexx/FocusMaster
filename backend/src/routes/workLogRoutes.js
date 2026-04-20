const express = require("express");
const router = express.Router();
const {
  startClock,
  stopClock,
  getWorkLogs,
} = require("../controllers/workLogController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { workLogStopSchema } = require("../validation/schemas");

router.post("/start", protect, startClock);
router.post("/stop", protect, validate({ body: workLogStopSchema }), stopClock);
router.get("/logs", protect, getWorkLogs);

module.exports = router;
