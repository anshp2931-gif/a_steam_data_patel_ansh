const Game = require("../models/game.model");

// GET all games from MongoDB
const getAllGames = async (req, res) => {
  try {
    // Fetch all games from games collection
    const games = await Game.find();

    // Count total games
    const totalGames = await Game.countDocuments();

    res.status(200).json({
      success: true,
      message: "All games fetched successfully",
      totalGames: totalGames,
      data: games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

// GET single game by appid
const getGameByAppId = async (req, res) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Game fetched successfully",
      data: game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching game",
      error: error.message,
    });
  }
};

module.exports = {
  getAllGames,
  getGameByAppId,
};