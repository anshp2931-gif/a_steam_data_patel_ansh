const express = require("express");
const Game = require("../models/game.model");

const router = express.Router();

// GET /api/v1/search/games?q=elden
router.get("/games", async (req, res, next) => {
  try {
    const queryText = req.query.q || "";
    if (!queryText.trim()) return res.status(400).json({ success: false, message: "Search query 'q' cannot be empty" });

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
    res.status(200).json({ success: true, statusCode: 200, data: results, message: `Search results for '${queryText}'` });
  } catch (error) { next(error); }
});

module.exports = router;
