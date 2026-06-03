const logger = require("../utils/logger");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  const isProduction = process.env.NODE_ENV === "production";

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  logger.error("Unhandled request error", {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    message:
      isProduction && statusCode >= 500 ? "Internal Server Error" : message,
    requestId: req.id,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
