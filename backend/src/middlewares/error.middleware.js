const ApiError = require("../utils/ApiError");
const envConfig = require("../config/env.config");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert generic errors to ApiError if not already
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  // Handle Mongoose Validation Error
  if (error.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message).join(", ");
    error = new ApiError(400, message);
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (error.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field: ${field}. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid authentication token. Access denied.");
  }
  if (error.name === "TokenExpiredError") {
    error = new ApiError(401, "Authentication token has expired. Please log in again.");
  }

  // Final structured response
  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(envConfig.debugMode && { stack: error.stack })
  };

  if (envConfig.debugMode) {
    console.error(`[Error] ${req.method} ${req.url} - Status: ${error.statusCode} - Msg: ${error.message}`);
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
