require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const startCleanupJob = require("./scripts/cleanupOldData");
const logger = require("./utils/logger");

const env = validateEnv();
const PORT = env.PORT;

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );

      // node-cron only runs on traditional long-lived servers (local dev,
      // Render, Railway, etc.). On Vercel, the serverless function has no
      // persistent process, so Vercel Cron calls POST /api/cron/cleanup
      // instead — the schedule is defined in vercel.json.
      if (!process.env.VERCEL) {
        startCleanupJob();
      } else {
        console.log(
          "[Cleanup] Running on Vercel — cron handled by Vercel Cron (POST /api/cron/cleanup)",
        );
      }
    });
  } catch (error) {
    console.error("Failed to connect to DB, server not started:", error);
    process.exit(1);
  }
};

// Graceful shutdown helper
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      logger.info("HTTP server closed.");
      mongoose.connection
        .close(false)
        .then(() => {
          logger.info("MongoDB connection closed.");
          process.exit(0);
        })
        .catch((err) => {
          logger.error("Error during MongoDB disconnection:", err);
          process.exit(1);
        });
    });
  } else {
    mongoose.connection
      .close(false)
      .then(() => {
        logger.info("MongoDB connection closed.");
        process.exit(0);
      })
      .catch((err) => {
        logger.error("Error during MongoDB disconnection:", err);
        process.exit(1);
      });
  }
};

// Listen for termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions and unhandled rejections to prevent silent crashes
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION: Process terminating...", {
    error: error.message,
    stack: error.stack,
  });
  // If server is active, try to close it and Mongoose connection before exiting
  if (server) {
    server.close(() => {
      mongoose.connection.close(false).finally(() => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION: Process terminating...", {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  if (server) {
    server.close(() => {
      mongoose.connection.close(false).finally(() => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});

startServer();

module.exports = app;
