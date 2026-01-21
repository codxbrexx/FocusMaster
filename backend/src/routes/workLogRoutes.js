const express = require("express");
const router = express.Router();
const {
  startClock,
  stopClock,
  getWorkLogs,
} = require("../controllers/workLogController");
const { protect } = require("../middleware/authMiddleware");

router.post("/start", protect, startClock);
router.post("/stop", protect, stopClock);
router.get("/logs", protect, getWorkLogs);

module.exports = router;
