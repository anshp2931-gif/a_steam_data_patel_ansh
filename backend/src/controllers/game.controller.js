const gameService = require("../services/game.service");
const aggregationService = require("../services/aggregation.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Controller for Game operations
 */

const createGame = asyncHandler(async (req, res) => {
  const game = await gameService.createGame(req.body);
  res.status(201).json(new ApiResponse(201, game, "Game created successfully"));
});

const getAllGames = asyncHandler(async (req, res) => {
  const { games, paginationMeta } = await gameService.getGames(req.query);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Games fetched successfully",
    pagination: paginationMeta,
    data: games
  });
});

const getGameByAppId = asyncHandler(async (req, res) => {
  const game = await gameService.getGameByAppId(req.params.appid);
  res.status(200).json(new ApiResponse(200, game, "Game details fetched successfully"));
});

const updateGame = asyncHandler(async (req, res) => {
  const game = await gameService.updateGame(req.params.appid, req.body);
  res.status(200).json(new ApiResponse(200, game, "Game updated successfully"));
});

const deleteGame = asyncHandler(async (req, res) => {
  const game = await gameService.softDeleteGame(req.params.appid);
  res.status(200).json(new ApiResponse(200, game, "Game soft deleted successfully"));
});

// Analytics & Aggregations
const getGenreStats = asyncHandler(async (req, res) => {
  const stats = await aggregationService.getGenreStats();
  res.status(200).json(new ApiResponse(200, stats, "Genre statistics fetched successfully"));
});

const getPriceTierStats = asyncHandler(async (req, res) => {
  const stats = await aggregationService.getPriceTierStats();
  res.status(200).json(new ApiResponse(200, stats, "Price tier statistics fetched successfully"));
});

const getDeveloperRankings = asyncHandler(async (req, res) => {
  const rankings = await aggregationService.getDeveloperRankings();
  res.status(200).json(new ApiResponse(200, rankings, "Developer rankings fetched successfully"));
});

const getReleaseYearTrends = asyncHandler(async (req, res) => {
  const trends = await aggregationService.getReleaseYearTrends();
  res.status(200).json(new ApiResponse(200, trends, "Yearly release trends fetched successfully"));
});

module.exports = {
  createGame,
  getAllGames,
  getGameByAppId,
  updateGame,
  deleteGame,
  getGenreStats,
  getPriceTierStats,
  getDeveloperRankings,
  getReleaseYearTrends
};