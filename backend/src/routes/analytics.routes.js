const express = require("express");
const Game = require("../models/game.model");
const NF = { isDeleted: { $ne: true } };

const router = express.Router();

router.get("/games/top-rated", async (req, res, next) => {
  try {
    const games = await Game.find(NF).sort({ rating: -1 }).limit(10);
    res.status(200).json({ success: true, statusCode: 200, data: games, message: "Top rated games analytics" });
  } catch (error) { next(error); }
});

router.get("/games/most-downloaded", async (req, res, next) => {
  try {
    const games = await Game.find(NF).sort({ downloads: -1 }).limit(10);
    res.status(200).json({ success: true, statusCode: 200, data: games, message: "Most downloaded games analytics" });
  } catch (error) { next(error); }
});

router.get("/games/revenue", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF },
      { $project: { appid: 1, name: 1, price: 1, downloads: 1, estimatedRevenue: { $multiply: ["$price", "$downloads"] } } },
      { $sort: { estimatedRevenue: -1 } }, { $limit: 10 }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Revenue analysis completed successfully" });
  } catch (error) { next(error); }
});

router.get("/games/platform-distribution", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF }, { $unwind: "$platforms" },
      { $group: { _id: "$platforms", count: { $sum: 1 }, averagePrice: { $avg: "$price" } } },
      { $project: { platform: "$_id", count: 1, averagePrice: { $round: ["$averagePrice", 2] }, _id: 0 } }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Platform distribution analytics" });
  } catch (error) { next(error); }
});

router.get("/games/genre-distribution", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF }, { $unwind: "$genres" },
      { $group: { _id: "$genres", count: { $sum: 1 }, averagePrice: { $avg: "$price" } } },
      { $project: { genre: "$_id", count: 1, averagePrice: { $round: ["$averagePrice", 2] }, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Genre distribution analytics" });
  } catch (error) { next(error); }
});

router.get("/games/trending", async (req, res, next) => {
  try {
    const games = await Game.find(NF).sort({ recommendations: -1 }).limit(5);
    res.status(200).json({ success: true, statusCode: 200, data: games, message: "Trending games analytics" });
  } catch (error) { next(error); }
});

router.get("/games/release-trends", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: { ...NF, release_year: { $exists: true, $ne: "" } } },
      { $group: { _id: "$release_year", count: { $sum: 1 }, averagePrice: { $avg: "$price" } } },
      { $project: { year: "$_id", count: 1, averagePrice: { $round: ["$averagePrice", 2] }, _id: 0 } },
      { $sort: { year: -1 } }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Release year trends analytics" });
  } catch (error) { next(error); }
});

router.get("/games/user-activity", async (req, res, next) => {
  try {
    res.status(200).json({ success: true, statusCode: 200, data: { activeUsersToday: 12500, peakConcurrentPlayers: 89000, gamesPlayedToday: 34200, hoursStreamed: 1420 }, message: "User activity analytics" });
  } catch (error) { next(error); }
});

router.get("/games/wishlist-analysis", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF },
      { $project: { appid: 1, name: 1, recommendations: 1, mockWishlistCount: { $multiply: ["$recommendations", 3] } } },
      { $sort: { mockWishlistCount: -1 } }, { $limit: 10 }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Wishlist analytics" });
  } catch (error) { next(error); }
});

router.get("/games/review-analysis", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF },
      { $project: { appid: 1, name: 1, rating: 1, totalReviewsCount: { $size: { $ifNull: ["$reviews", []] } } } },
      { $sort: { totalReviewsCount: -1 } }, { $limit: 10 }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Review metrics analytics" });
  } catch (error) { next(error); }
});

module.exports = router;
