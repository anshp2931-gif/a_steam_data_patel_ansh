const express = require("express");
const Game = require("../models/game.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/rbac.middleware");
const { validateGameInput } = require("../middlewares/validate.middleware");

const router = express.Router();

// Middleware checking for all endpoints
router.use(authProtect);

// 1. GET /api/v1/admin/games - Admin protected games route
router.get("/admin/games", authorizeRoles("admin"), asyncHandler(async (req, res) => {
  const games = await Game.find({ isDeleted: { $ne: true } });
  res.status(200).json(new ApiResponse(200, games, "Admin protected games loaded"));
}));

// 2. GET /api/v1/admin/analytics - Admin protected analytics dashboard
router.get("/admin/analytics", authorizeRoles("admin"), asyncHandler(async (req, res) => {
  const stats = {
    totalRevenue: 542000,
    activeSubscribers: 4300,
    serverCPUUsage: "12%",
    apiCallsToday: 450000
  };
  res.status(200).json(new ApiResponse(200, stats, "Admin analytics dashboard loaded"));
}));

// 3. GET /api/v1/admin/reports - Admin protected reports route
router.get("/admin/reports", authorizeRoles("admin"), asyncHandler(async (req, res) => {
  const reports = [
    { reportId: "R-101", title: "Daily Sales Report", status: "Generated" },
    { reportId: "R-102", title: "Weekly Active User Retention", status: "Processing" }
  ];
  res.status(200).json(new ApiResponse(200, reports, "Admin reports list loaded"));
}));

// 4. POST /api/v1/protected/games - Protected route to add games
router.post("/protected/games", authorizeRoles("admin"), validateGameInput, asyncHandler(async (req, res) => {
  const game = await Game.create(req.body);
  res.status(201).json(new ApiResponse(201, game, "Game added successfully via protected route"));
}));

// 5. PATCH /api/v1/protected/games/:appid - Protected route to update games
router.patch("/protected/games/:appid", authorizeRoles("admin"), asyncHandler(async (req, res) => {
  const game = await Game.findOneAndUpdate(
    { appid: req.params.appid, isDeleted: { $ne: true } },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game, "Game updated via protected route"));
}));

// 6. DELETE /api/v1/protected/games/:appid - Protected route to delete games
router.delete("/protected/games/:appid", authorizeRoles("admin"), asyncHandler(async (req, res) => {
  const game = await Game.findOneAndDelete({ appid: req.params.appid });
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, null, "Game permanently deleted via protected route"));
}));

module.exports = router;
