const express = require("express");

const {
  getAllGames,
  getGameByAppId,
} = require("../controllers/game.controller");

const router = express.Router();

router.get("/", getAllGames);
router.get("/:appid", getGameByAppId);

module.exports = router;