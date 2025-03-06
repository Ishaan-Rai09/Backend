// 404 Not Found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  // Log error
  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  // Send error response
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};

module.exports = {
  notFound,
  errorHandler
}; 