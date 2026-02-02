const express = require("express");
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getSessionStats,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getSessions).post(protect, createSession);
router.get("/stats", protect, getSessionStats);
router
  .route("/:id")
  .get(protect, getSession)
  .patch(protect, updateSession)
  .delete(protect, deleteSession);

module.exports = router;
