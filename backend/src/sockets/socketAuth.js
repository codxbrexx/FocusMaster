const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function socketAuth(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
      socket.handshake.headers?.cookie
        ?.split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

    if (!token) {
      // Guest access fallback
      socket.user = {
        _id: `guest-${socket.id}`,
        name: `Guest ${socket.id.substring(0, 4)}`,
        picture: "https://github.com/shadcn.png",
        isGuest: true,
      };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      socket.user = {
        _id: `guest-${socket.id}`,
        name: "Guest",
        picture: "https://github.com/shadcn.png",
        isGuest: true,
      };
    } else {
      socket.user = user;
    }

    next();
  } catch (error) {
    socket.user = {
      _id: `guest-${socket.id}`,
      name: `Guest ${socket.id.substring(0, 4)}`,
      picture: "https://github.com/shadcn.png",
      isGuest: true,
    };
    next();
  }
}

module.exports = socketAuth;
