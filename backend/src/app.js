const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const gameRoutes = require("./routes/game.routes");
const jwtRoutes = require("./routes/jwt.routes");
const healthRoutes = require("./routes/health.routes");
const searchRoutes = require("./routes/search.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const statsRoutes = require("./routes/stats.routes");
const middlewareRoutes = require("./routes/middleware.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

// Base route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Steam Games Backend API is running. Access endpoints via /api/v1/..." });
});

// API Routes
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

module.exports = app;