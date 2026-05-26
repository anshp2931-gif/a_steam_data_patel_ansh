const express = require("express");
const cors = require("cors");
const requestLogger = require("./middlewares/logger.middleware");
const rateLimiter = require("./middlewares/rateLimiter.middleware");
const errorHandler = require("./middlewares/error.middleware");

// Routes
const gameRoutes = require("./routes/game.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Rate limiting middleware
app.use(rateLimiter);

// Base route
app.get("/", (req, res) => {
  res.send("Steam Games Backend API is running. Access endpoints via /api/v1/... ");
});

// API versioning endpoint routing
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/games", gameRoutes);

// Catch all unmatched routes (404 handler)
app.use((req, res, next) => {
  const ApiError = require("./utils/ApiError");
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global central error handler middleware
app.use(errorHandler);

module.exports = app;