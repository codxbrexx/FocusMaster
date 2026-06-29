const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  // Check Authorization header as fallback
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user no longer exists");
      }

      next();
    } catch (error) {
      if (res.statusCode !== 401) {
        res.status(401);
      }
      // Re-throw our own specific errors verbatim; replace JWT library errors
      // with a generic message so we don't leak JWT internals to the client.
      if (
        error.message === "Not authorized, user no longer exists" ||
        error.message === "Not authorized, token failed"
      ) {
        throw error;
      }
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
