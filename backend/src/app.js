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
const searchRoutes = require("./routes/search.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const statsRoutes = require("./routes/stats.routes");
const jwtRoutes = require("./routes/jwt.routes");
const middlewareRoutes = require("./routes/middleware.routes");
const adminRoutes = require("./routes/admin.routes");

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
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/jwt", jwtRoutes);
app.use("/api/v1/middleware", middlewareRoutes);
app.use("/api/v1", adminRoutes); // Handles /api/v1/admin and /api/v1/protected

// Catch all unmatched routes (404 handler)
app.use((req, res, next) => {
  const ApiError = require("./utils/ApiError");
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global central error handler middleware
app.use(errorHandler);

module.exports = app;