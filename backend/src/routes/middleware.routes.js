const express = require("express");
const { authProtect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/logger", (req, res) => {
  res.status(200).json({ success: true, statusCode: 200, data: { logStatus: "Logged successfully" }, message: "Request logger middleware check completed" });
});

router.get("/auth", authProtect, (req, res) => {
  res.status(200).json({ success: true, statusCode: 200, data: { user: req.user }, message: "Authentication middleware practice completed" });
});

router.get("/rate-limit", (req, res) => {
  res.status(200).json({ success: true, statusCode: 200, data: { rateLimitStatus: "Allowed" }, message: "Rate limiting check completed" });
});

router.get("/error-handler", (req, res, next) => {
  const err = new Error("Global error handler practice. This is a handled test error!");
  err.statusCode = 400;
  next(err);
});

module.exports = router;
