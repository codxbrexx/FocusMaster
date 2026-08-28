const asyncHandler = require("express-async-handler");
const FocusRoom = require("../models/FocusRoom");

// @desc    Get all public or stream focus rooms
// @route   GET /api/rooms
// @access  Private
const getRooms = asyncHandler(async (req, res) => {
  const { stream, visibility } = req.query;
  const filter = { status: { $ne: "closed" } };

  if (stream && stream !== "all") {
    filter.stream = stream;
  }

  if (visibility) {
    filter.visibility = visibility;
  } else {
    filter.visibility = { $in: ["public", "stream"] };
  }

  const rooms = await FocusRoom.find(filter)
    .populate("host", "name picture")
    .populate("participants.user", "name picture")
    .sort({ createdAt: -1 });

  res.status(200).json(rooms);
});

// @desc    Create a new focus room
// @route   POST /api/rooms
// @access  Private
const createRoom = asyncHandler(async (req, res) => {
  const { name, description, maxParticipants, visibility, stream, timerConfig, ambientPreset } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Room name is required");
  }

  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
  const inviteCode = visibility === "private" ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined;

  const room = await FocusRoom.create({
    name: name.trim(),
    slug,
    description: description ? description.trim() : "",
    host: req.user._id,
    maxParticipants: maxParticipants || 25,
    visibility: visibility || "public",
    stream: stream || null,
    inviteCode,
    timerConfig: timerConfig || {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStart: false,
    },
    ambientPreset: ambientPreset || "none",
    participants: [
      {
        user: req.user._id,
        status: "idle",
      },
    ],
  });

  const populatedRoom = await FocusRoom.findById(room._id)
    .populate("host", "name picture")
    .populate("participants.user", "name picture");

  res.status(201).json(populatedRoom);
});

// @desc    Get single focus room by ID or Slug
// @route   GET /api/rooms/:id
// @access  Private
const getRoomById = asyncHandler(async (req, res) => {
  let room = await FocusRoom.findById(req.params.id)
    .populate("host", "name picture")
    .populate("participants.user", "name picture xp badges");

  if (!room) {
    room = await FocusRoom.findOne({ slug: req.params.id })
      .populate("host", "name picture")
      .populate("participants.user", "name picture xp badges");
  }

  if (!room) {
    res.status(404);
    throw new Error("Focus room not found");
  }

  res.status(200).json(room);
});

// @desc    Close / Delete a focus room (Host only)
// @route   DELETE /api/rooms/:id
// @access  Private
const closeRoom = asyncHandler(async (req, res) => {
  const room = await FocusRoom.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Focus room not found");
  }

  if (room.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the room host can close this room");
  }

  room.status = "closed";
  await room.save();

  res.status(200).json({ message: "Room closed successfully", roomId: room._id });
});

module.exports = {
  getRooms,
  createRoom,
  getRoomById,
  closeRoom,
};
