const express = require("express");
const router = express.Router();
const {
  getRooms,
  createRoom,
  getRoomById,
  closeRoom,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getRooms).post(protect, createRoom);
router.route("/:id").get(protect, getRoomById).delete(protect, closeRoom);

module.exports = router;
