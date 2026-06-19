const { ipKeyGenerator, rateLimit } = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 5 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req.ip),
  message: {
    message: "Too many API requests. Please slow down and try again shortly.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
