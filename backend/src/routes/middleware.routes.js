const express = require("express");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { authProtect } = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimiter.middleware");
const requestLogger = require("../middlewares/logger.middleware");

const router = express.Router();

// 1. Practice logger middleware
router.get("/logger", requestLogger, (req, res) => {
  res.status(200).json(new ApiResponse(200, { logStatus: "Logged successfully" }, "Request logger middleware check completed"));
});

// 2. Practice authentication middleware
router.get("/auth", authProtect, (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "Authentication middleware practice completed"));
});

// 3. Practice API rate limiting middleware
router.get("/rate-limit", rateLimiter, (req, res) => {
  res.status(200).json(new ApiResponse(200, { rateLimitStatus: "Allowed" }, "Rate limiting check completed"));
});

// 4. Practice global error handling middleware
router.get("/error-handler", (req, res, next) => {
  next(new ApiError(400, "Global error handler practice. This is a handled test error!"));
});

module.exports = router;
