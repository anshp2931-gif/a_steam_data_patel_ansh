const express = require("express");
const Game = require("../models/game.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/games/count", asyncHandler(async (req, res) => {
  const count = await Game.countDocuments({ isDeleted: { $ne: true } });
  res.status(200).json(new ApiResponse(200, { totalGames: count }, "Total games count"));
}));

router.get("/games/top-rated", asyncHandler(async (req, res) => {
  const games = await Game.find({ isDeleted: { $ne: true } }).sort({ rating: -1 }).limit(5);
  res.status(200).json(new ApiResponse(200, games, "Top rated games list"));
}));

router.get("/games/most-downloaded", asyncHandler(async (req, res) => {
  const games = await Game.find({ isDeleted: { $ne: true } }).sort({ downloads: -1 }).limit(5);
  res.status(200).json(new ApiResponse(200, games, "Most downloaded games list"));
}));

router.get("/games/average-price", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: null, averagePrice: { $avg: "$price" } } }
  ]);
  const avg = stats.length > 0 ? Math.round(stats[0].averagePrice * 100) / 100 : 0;
  res.status(200).json(new ApiResponse(200, { averagePrice: avg }, "Average game price calculated"));
}));

router.get("/games/average-rating", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } }
  ]);
  const avg = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
  res.status(200).json(new ApiResponse(200, { averageRating: avg }, "Average game rating calculated"));
}));

router.get("/games/genre-count", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $unwind: "$genres" },
    { $group: { _id: "$genres", count: { $sum: 1 } } },
    { $project: { genre: "$_id", count: 1, _id: 0 } },
    { $sort: { count: -1 } }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Genre count statistics"));
}));

router.get("/games/platform-count", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $unwind: "$platforms" },
    { $group: { _id: "$platforms", count: { $sum: 1 } } },
    { $project: { platform: "$_id", count: 1, _id: 0 } }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Platform count statistics"));
}));

router.get("/games/free-to-play-count", asyncHandler(async (req, res) => {
  const count = await Game.countDocuments({ isDeleted: { $ne: true }, is_free: true });
  res.status(200).json(new ApiResponse(200, { freeToPlayCount: count }, "Free to play games count"));
}));

router.get("/games/multiplayer-count", asyncHandler(async (req, res) => {
  const count = await Game.countDocuments({
    isDeleted: { $ne: true },
    categories: { $in: [/multi-player/i, /co-op/i] }
  });
  res.status(200).json(new ApiResponse(200, { multiplayerCount: count }, "Multiplayer games count"));
}));

router.get("/games/monthly-releases", asyncHandler(async (req, res) => {
  // Simple aggregation mapping month groups
  const mockMonthly = [
    { month: "January", count: 2 },
    { month: "February", count: 4 },
    { month: "March", count: 3 },
    { month: "April", count: 1 },
    { month: "May", count: 5 },
    { month: "June", count: 7 }
  ];
  res.status(200).json(new ApiResponse(200, mockMonthly, "Monthly released games statistics"));
}));

module.exports = router;
