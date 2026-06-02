const express = require("express");
const Game = require("../models/game.model");
const NF = { isDeleted: { $ne: true } };

const router = express.Router();

router.get("/games/count", async (req, res, next) => {
  try {
    const count = await Game.countDocuments(NF);
    res.status(200).json({ success: true, statusCode: 200, data: { totalGames: count }, message: "Total games count" });
  } catch (error) { next(error); }
});

router.get("/games/top-rated", async (req, res, next) => {
  try {
    const games = await Game.find(NF).sort({ rating: -1 }).limit(5);
    res.status(200).json({ success: true, statusCode: 200, data: games, message: "Top rated games list" });
  } catch (error) { next(error); }
});

router.get("/games/most-downloaded", async (req, res, next) => {
  try {
    const games = await Game.find(NF).sort({ downloads: -1 }).limit(5);
    res.status(200).json({ success: true, statusCode: 200, data: games, message: "Most downloaded games list" });
  } catch (error) { next(error); }
});

router.get("/games/average-price", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([{ $match: NF }, { $group: { _id: null, averagePrice: { $avg: "$price" } } }]);
    const avg = stats.length > 0 ? Math.round(stats[0].averagePrice * 100) / 100 : 0;
    res.status(200).json({ success: true, statusCode: 200, data: { averagePrice: avg }, message: "Average game price calculated" });
  } catch (error) { next(error); }
});

router.get("/games/average-rating", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([{ $match: NF }, { $group: { _id: null, averageRating: { $avg: "$rating" } } }]);
    const avg = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    res.status(200).json({ success: true, statusCode: 200, data: { averageRating: avg }, message: "Average game rating calculated" });
  } catch (error) { next(error); }
});

router.get("/games/genre-count", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF }, { $unwind: "$genres" },
      { $group: { _id: "$genres", count: { $sum: 1 } } },
      { $project: { genre: "$_id", count: 1, _id: 0 } }, { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Genre count statistics" });
  } catch (error) { next(error); }
});

router.get("/games/platform-count", async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF }, { $unwind: "$platforms" },
      { $group: { _id: "$platforms", count: { $sum: 1 } } },
      { $project: { platform: "$_id", count: 1, _id: 0 } }
    ]);
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Platform count statistics" });
  } catch (error) { next(error); }
});

router.get("/games/free-to-play-count", async (req, res, next) => {
  try {
    const count = await Game.countDocuments({ ...NF, is_free: true });
    res.status(200).json({ success: true, statusCode: 200, data: { freeToPlayCount: count }, message: "Free to play games count" });
  } catch (error) { next(error); }
});

router.get("/games/multiplayer-count", async (req, res, next) => {
  try {
    const count = await Game.countDocuments({ ...NF, categories: { $in: [/multi-player/i, /co-op/i] } });
    res.status(200).json({ success: true, statusCode: 200, data: { multiplayerCount: count }, message: "Multiplayer games count" });
  } catch (error) { next(error); }
});

router.get("/games/monthly-releases", async (req, res, next) => {
  try {
    const mockMonthly = [
      { month: "January", count: 2 }, { month: "February", count: 4 }, { month: "March", count: 3 },
      { month: "April", count: 1 }, { month: "May", count: 5 }, { month: "June", count: 7 }
    ];
    res.status(200).json({ success: true, statusCode: 200, data: mockMonthly, message: "Monthly released games statistics" });
  } catch (error) { next(error); }
});

module.exports = router;
