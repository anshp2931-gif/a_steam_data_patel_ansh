const Game = require("../models/game.model");

/**
 * Aggregation Framework Services for Advanced Steam Games Analytics
 */

// 1. Get genre statistics: counts, average price, total recommendations grouped by genre
const getGenreStats = async () => {
  return await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        totalGames: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        avgRecommendations: { $avg: "$recommendations" },
        totalRecommendations: { $sum: "$recommendations" }
      }
    },
    {
      $project: {
        genre: "$_id",
        totalGames: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
        minPrice: 1,
        maxPrice: 1,
        avgRecommendations: { $round: ["$avgRecommendations", 0] },
        totalRecommendations: 1,
        _id: 0
      }
    },
    { $sort: { totalGames: -1 } }
  ]);
};

// 2. Get price tier stats: categorize games into Free, Budget (<15), Premium (15-40), Elite (>40)
const getPriceTierStats = async () => {
  return await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        priceTier: {
          $cond: {
            if: { $eq: ["$price", 0] },
            then: "Free to Play",
            else: {
              $cond: {
                if: { $lt: ["$price", 15] },
                then: "Budget (Under $15)",
                else: {
                  $cond: {
                    if: { $lte: ["$price", 40] },
                    then: "Premium ($15 - $40)",
                    else: "Elite (Over $40)"
                  }
                }
              }
            }
          }
        },
        price: 1,
        recommendations: 1
      }
    },
    {
      $group: {
        _id: "$priceTier",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        totalRecommendations: { $sum: "$recommendations" }
      }
    },
    {
      $project: {
        tier: "$_id",
        count: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
        totalRecommendations: 1,
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// 3. Get Developer Rankings: top developers by total recommendations, count of games
const getDeveloperRankings = async () => {
  return await Game.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$developer",
        gamesCount: { $sum: 1 },
        totalRecommendations: { $sum: "$recommendations" },
        avgPrice: { $avg: "$price" }
      }
    },
    {
      $project: {
        developer: "$_id",
        gamesCount: 1,
        totalRecommendations: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
        _id: 0
      }
    },
    { $sort: { totalRecommendations: -1, gamesCount: -1 } },
    { $limit: 10 } // Return top 10 developers
  ]);
};

// 4. Get release year trends: games per year, average recommendation and average price
const getReleaseYearTrends = async () => {
  return await Game.aggregate([
    { $match: { isDeleted: { $ne: true }, release_year: { $exists: true, $ne: "" } } },
    {
      $group: {
        _id: "$release_year",
        gamesReleased: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        totalRecommendations: { $sum: "$recommendations" }
      }
    },
    {
      $project: {
        year: "$_id",
        gamesReleased: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
        totalRecommendations: 1,
        _id: 0
      }
    },
    { $sort: { year: -1 } } // Sort newest year to oldest
  ]);
};

module.exports = {
  getGenreStats,
  getPriceTierStats,
  getDeveloperRankings,
  getReleaseYearTrends
};
