const FocusRoom = require("../models/FocusRoom");
const { awardXP } = require("../services/xpService");

// Map of active room timers: roomId -> { intervalId, timeLeft, mode, isActive }
const activeTimers = new Map();

function startRoomTimer(io, roomId, durationMinutes = 25) {
  if (activeTimers.has(roomId)) {
    const timer = activeTimers.get(roomId);
    timer.isActive = true;
    return timer;
  }

  const state = {
    timeLeft: durationMinutes * 60,
    mode: "focus", // "focus" | "shortBreak" | "longBreak"
    isActive: true,
    totalDuration: durationMinutes * 60,
    intervalId: null,
  };

  state.intervalId = setInterval(async () => {
    if (!state.isActive) return;

    state.timeLeft -= 1;

    if (state.timeLeft <= 0) {
      clearInterval(state.intervalId);
      activeTimers.delete(roomId);

      // Timer complete! Transition state & award XP to active room participants
      try {
        const room = await FocusRoom.findById(roomId).populate("participants.user");
        if (room) {
          if (state.mode === "focus") {
            room.status = "break";
            room.totalSessions += 1;
            room.totalFocusMinutes += Math.round(state.totalDuration / 60);

            // Award room XP (+15 XP per focus session) to participants
            for (const p of room.participants) {
              if (p.user && p.user._id && !p.user.isGuest) {
                await awardXP(p.user._id, 15, "room_focus_session");
                p.xpEarned += 15;
              }
            }

            await room.save();

            io.to(roomId).emit("room:timer-complete", {
              mode: "focus",
              nextMode: "shortBreak",
              message: "Focus session complete! Take a break.",
            });
          } else {
            room.status = "waiting";
            await room.save();

            io.to(roomId).emit("room:timer-complete", {
              mode: "break",
              nextMode: "focus",
              message: "Break complete! Ready for next session.",
            });
          }
        }
      } catch (err) {
        console.error("Timer completion error:", err);
      }
      return;
    }

    io.to(roomId).emit("room:timer-sync", {
      timeLeft: state.timeLeft,
      totalDuration: state.totalDuration,
      mode: state.mode,
      isActive: state.isActive,
    });
  }, 1000);

  activeTimers.set(roomId, state);
  return state;
}

function pauseRoomTimer(io, roomId) {
  if (activeTimers.has(roomId)) {
    const timer = activeTimers.get(roomId);
    timer.isActive = false;
    io.to(roomId).emit("room:timer-sync", {
      timeLeft: timer.timeLeft,
      totalDuration: timer.totalDuration,
      mode: timer.mode,
      isActive: false,
    });
  }
}

function resetRoomTimer(io, roomId, durationMinutes = 25) {
  if (activeTimers.has(roomId)) {
    const timer = activeTimers.get(roomId);
    clearInterval(timer.intervalId);
    activeTimers.delete(roomId);
  }

  io.to(roomId).emit("room:timer-sync", {
    timeLeft: durationMinutes * 60,
    totalDuration: durationMinutes * 60,
    mode: "focus",
    isActive: false,
  });
}

function getTimerState(roomId) {
  return activeTimers.get(roomId) || null;
}

module.exports = {
  startRoomTimer,
  pauseRoomTimer,
  resetRoomTimer,
  getTimerState,
};
