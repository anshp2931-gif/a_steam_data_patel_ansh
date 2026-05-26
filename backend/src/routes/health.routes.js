const express = require("express");
const mongoose = require("mongoose");
const ApiResponse = require("../utils/ApiResponse");

const router = express.Router();

/**
 * Health Check API
 * Useful for deployment monitoring and checking server/DB statuses
 */
router.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  const healthInfo = {
    status: "Healthy",
    timestamp: new Date(),
    uptime: `${process.uptime().toFixed(2)} seconds`,
    database: dbStatus,
    platform: process.platform,
    nodeVersion: process.version,
    memoryUsage: {
      rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
    }
  };

  res.status(200).json(new ApiResponse(200, healthInfo, "Backend Server Health check completed."));
});

module.exports = router;
