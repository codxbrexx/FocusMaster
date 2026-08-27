const { Server } = require("socket.io");
const socketAuth = require("./socketAuth");
const registerRoomHandlers = require("./roomManager");

function initSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    registerRoomHandlers(io, socket);
  });

  return io;
}

module.exports = initSocketServer;
