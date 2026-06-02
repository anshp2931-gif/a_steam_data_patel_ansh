const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Backend Server Health check completed.",
    data: {
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
    }
  });
});

module.exports = router;
