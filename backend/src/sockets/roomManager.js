const FocusRoom = require("../models/FocusRoom");
const User = require("../models/User");
const { startRoomTimer, pauseRoomTimer, resetRoomTimer, getTimerState } = require("./timerEngine");

function registerRoomHandlers(io, socket) {
  const user = socket.user;

  // Handle joining a room
  socket.on("room:join", async ({ roomId }) => {
    try {
      const room = await FocusRoom.findById(roomId).populate("participants.user", "name picture xp badges");
      if (!room) {
        return socket.emit("error", { message: "Room not found" });
      }

      socket.join(roomId);
      socket.currentRoomId = roomId;

      // Add participant if not already present
      const userIdStr = user._id.toString();
      const existingIdx = room.participants.findIndex(
        (p) => p.user && p.user._id.toString() === userIdStr
      );

      if (existingIdx === -1 && !user.isGuest) {
        room.participants.push({
          user: user._id,
          joinedAt: new Date(),
          status: "idle",
          isMuted: false,
        });
        await room.save();

        // Increment user roomsJoined count
        await User.findByIdAndUpdate(user._id, { $inc: { roomsJoined: 1 } });
      }

      // Sync active timer state if present
      const timerState = getTimerState(roomId);
      if (timerState) {
        socket.emit("room:timer-sync", {
          timeLeft: timerState.timeLeft,
          totalDuration: timerState.totalDuration,
          mode: timerState.mode,
          isActive: timerState.isActive,
        });
      }

      // Broadcast user-joined to room
      io.to(roomId).emit("room:user-joined", {
        user: {
          _id: user._id,
          name: user.name,
          picture: user.picture,
        },
        participantsCount: room.participants.length,
      });
    } catch (err) {
      console.error("room:join error:", err);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Handle room timer controls
  socket.on("room:start-timer", async ({ roomId, durationMinutes }) => {
    startRoomTimer(io, roomId, durationMinutes || 25);
    await FocusRoom.findByIdAndUpdate(roomId, { status: "focusing" });
  });

  socket.on("room:pause-timer", ({ roomId }) => {
    pauseRoomTimer(io, roomId);
  });

  socket.on("room:reset-timer", ({ roomId, durationMinutes }) => {
    resetRoomTimer(io, roomId, durationMinutes || 25);
  });

  // Handle participant status/mute toggle
  socket.on("room:status-update", async ({ roomId, status, isMuted }) => {
    io.to(roomId).emit("room:participant-status", {
      userId: user._id,
      status,
      isMuted,
    });
  });

  // Handle room chat messages
  socket.on("room:chat-message", ({ roomId, text }) => {
    if (!text || !text.trim()) return;

    io.to(roomId).emit("room:chat-message", {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user: {
        _id: user._id,
        name: user.name,
        picture: user.picture,
      },
      text: text.trim().substring(0, 300),
      timestamp: new Date().toISOString(),
    });
  });

  // Handle leaving room
  socket.on("room:leave", async () => {
    if (!socket.currentRoomId) return;

    const roomId = socket.currentRoomId;
    socket.leave(roomId);
    socket.currentRoomId = null;

    try {
      const room = await FocusRoom.findById(roomId);
      if (room && !user.isGuest) {
        room.participants = room.participants.filter(
          (p) => p.user && p.user.toString() !== user._id.toString()
        );
        await room.save();
      }

      io.to(roomId).emit("room:user-left", {
        userId: user._id,
        userName: user.name,
      });
    } catch (err) {
      console.error("room:leave error:", err);
    }
  });

  socket.on("disconnect", async () => {
    if (socket.currentRoomId) {
      socket.emit("room:leave");
    }
  });
}

module.exports = registerRoomHandlers;
