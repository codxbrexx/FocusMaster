const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const logger = require("./utils/logger");

// Route imports
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const workLogRoutes = require("./routes/workLogRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const llmRoutes = require("./routes/llmRoutes");
const seedRoutes = require("./routes/seedRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
app.set("trust proxy", 1);

const isProduction = process.env.NODE_ENV === "production";
const defaultDevOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  (isProduction ? "" : defaultDevOrigins.join(","))
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);

  logger.info("Incoming request", {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
  });

  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (configuredOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn("CORS blocked origin", {
          origin,
          allowedOrigins: configuredOrigins,
        });
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/clock", workLogRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", require("./admin/routes/adminRoutes"));

app.get(["/favicon.ico", "/favicon.png"], (req, res) => res.status(204).end());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

app.get("/", (req, res) => {
  res.send("FocusMaster API is running...");
});

//error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
