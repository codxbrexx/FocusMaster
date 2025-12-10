const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  console.error('[Error Middleware Caught]:', err); // Log full error to Vercel console

  res.status(statusCode).json({
    message,
    stack: err.stack, // TEMPORARY DEBUGGING: Always show stack
  });
};

module.exports = { notFound, errorHandler };
