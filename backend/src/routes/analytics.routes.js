const express = require("express");
const Game = require("../models/game.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/games/top-rated", asyncHandler(async (req, res) => {
  const games = await Game.find({ isDeleted: { $ne: true } }).sort({ rating: -1 }).limit(10);
  res.status(200).json(new ApiResponse(200, games, "Top rated games analytics"));
}));

router.get("/games/most-downloaded", asyncHandler(async (req, res) => {
  const games = await Game.find({ isDeleted: { $ne: true } }).sort({ downloads: -1 }).limit(10);
  res.status(200).json(new ApiResponse(200, games, "Most downloaded games analytics"));
}));

router.get("/games/revenue", asyncHandler(async (req, res) => {
  // Analytical Group Pipeline for revenue analysis (mock/calculated by downloads * price)
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        appid: 1,
        name: 1,
        price: 1,
        downloads: 1,
        estimatedRevenue: { $multiply: ["$price", "$downloads"] }
      }
    },
    { $sort: { estimatedRevenue: -1 } },
    { $limit: 10 }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Revenue analysis completed successfully"));
}));

router.get("/games/platform-distribution", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $unwind: "$platforms" },
    {
      $group: {
        _id: "$platforms",
        count: { $sum: 1 },
        averagePrice: { $avg: "$price" }
      }
    },
    {
      $project: {
        platform: "$_id",
        count: 1,
        averagePrice: { $round: ["$averagePrice", 2] },
        _id: 0
      }
    }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Platform distribution analytics"));
}));

router.get("/games/genre-distribution", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        count: { $sum: 1 },
        averagePrice: { $avg: "$price" }
      }
    },
    {
      $project: {
        genre: "$_id",
        count: 1,
        averagePrice: { $round: ["$averagePrice", 2] },
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Genre distribution analytics"));
}));

router.get("/games/trending", asyncHandler(async (req, res) => {
  const games = await Game.find({ isDeleted: { $ne: true } }).sort({ recommendations: -1 }).limit(5);
  res.status(200).json(new ApiResponse(200, games, "Trending games analytics"));
}));

router.get("/games/release-trends", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true }, release_year: { $exists: true, $ne: "" } } },
    {
      $group: {
        _id: "$release_year",
        count: { $sum: 1 },
        averagePrice: { $avg: "$price" }
      }
    },
    {
      $project: {
        year: "$_id",
        count: 1,
        averagePrice: { $round: ["$averagePrice", 2] },
        _id: 0
      }
    },
    { $sort: { year: -1 } }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Release year trends analytics"));
}));

router.get("/games/user-activity", asyncHandler(async (req, res) => {
  const mockActivity = {
    activeUsersToday: 12500,
    peakConcurrentPlayers: 89000,
    gamesPlayedToday: 34200,
    hoursStreamed: 1420
  };
  res.status(200).json(new ApiResponse(200, mockActivity, "User activity analytics"));
}));

router.get("/games/wishlist-analysis", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        appid: 1,
        name: 1,
        recommendations: 1,
        mockWishlistCount: { $multiply: ["$recommendations", 3] }
      }
    },
    { $sort: { mockWishlistCount: -1 } },
    { $limit: 10 }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Wishlist analytics"));
}));

router.get("/games/review-analysis", asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        appid: 1,
        name: 1,
        rating: 1,
        totalReviewsCount: { $size: { $ifNull: ["$reviews", []] } }
      }
    },
    { $sort: { totalReviewsCount: -1 } },
    { $limit: 10 }
  ]);
  res.status(200).json(new ApiResponse(200, stats, "Review metrics analytics"));
}));

module.exports = router;
