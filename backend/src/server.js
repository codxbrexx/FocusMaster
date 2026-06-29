require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const startCleanupJob = require("./scripts/cleanupOldData");

const env = validateEnv();
const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
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

startServer();

module.exports = app;
