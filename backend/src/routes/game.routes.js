const express = require("express");
const {
  createGame,
  getAllGames,
  getGameByAppId,
  updateGame,
  deleteGame,
  getGenreStats,
  getPriceTierStats,
  getDeveloperRankings,
  getReleaseYearTrends
} = require("../controllers/game.controller");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/rbac.middleware");
const { validateGameInput } = require("../middlewares/validate.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllGames);
router.get("/appid/:appid", getGameByAppId);

// Statistics and Analytical Aggregation routes (Public/Authentic depending on scope, let's keep public for general dashboard stats)
router.get("/stats/genre", getGenreStats);
router.get("/stats/price-tier", getPriceTierStats);
router.get("/stats/developer-rankings", getDeveloperRankings);
router.get("/stats/release-trends", getReleaseYearTrends);

// Admin-only protected CRUD routes
router.post(
  "/",
  authProtect,
  authorizeRoles("admin"),
  validateGameInput,
  createGame
);

router.put(
  "/appid/:appid",
  authProtect,
  authorizeRoles("admin"),
  validateGameInput,
  updateGame
);

router.delete(
  "/appid/:appid",
  authProtect,
  authorizeRoles("admin"),
  deleteGame
);

module.exports = router;