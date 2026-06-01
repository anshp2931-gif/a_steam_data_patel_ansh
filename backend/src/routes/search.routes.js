const express = require("express");
const Game = require("../models/game.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Perform full text search / api/v1/search/games?q=elden
router.get("/games", asyncHandler(async (req, res) => {
  const queryText = req.query.q || "";
  
  if (!queryText.trim()) {
    throw new ApiError(400, "Search query 'q' cannot be empty");
  }

  // Use Text indexing search or Regex match fallback
  const results = await Game.find({
    isDeleted: { $ne: true },
    $or: [
      { $text: { $search: queryText } },
      { name: { $regex: queryText, $options: "i" } },
      { developer: { $regex: queryText, $options: "i" } },
      { publisher: { $regex: queryText, $options: "i" } },
      { genres: { $in: [new RegExp(queryText, "i")] } },
      { categories: { $in: [new RegExp(queryText, "i")] } },
      { tags: { $in: [new RegExp(queryText, "i")] } }
    ]
  });

  res.status(200).json(new ApiResponse(200, results, `Search results for '${queryText}'`));
}));

module.exports = router;
