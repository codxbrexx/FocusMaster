require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");

const env = validateEnv();
const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to connect to DB, server not started:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
