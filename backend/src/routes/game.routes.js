const express = require("express");
const Game = require("../models/game.model");
const {
  getAllGames, getGameByAppId, createGame, updateGame, partialUpdateGame, deleteGame,
  checkGameExists, getGameSummary, getGameHistory, archiveGame, restoreGame, getRelatedGames,
  getGameScreenshots, getGameTrailers, getGameReviews, addGameReview, updateGameReview, deleteGameReview,
  getSystemRequirements, getGameDLC, getGameAchievements, getGameLeaderboards, getGameUpdates, getGameNews,
  getGamesByGenre, getGamesByDeveloper, getGamesByPublisher, getGamesByPlatform, getGamesByTag,
  getGamesByReleaseYear, getGamesByRating, getGamesByPrice, getGamesByFeature,
  getFreeToPlayGames, getPaidGames, getDiscountedGames, getEarlyAccessGames, getVrOnlyGames,
  getControllerSupportGames, getMultiplayerGames, getSingleplayerGames, getCoopGames,
  getOpenWorldGames, getSurvivalGames, getHorrorGames, getAnimeGames, getIndieGames, getTopRatedGames,
  sortGamesPriceDesc, sortGamesRatingDesc, sortGamesDownloadsDesc, sortGamesReleaseDateDesc, sortGamesPopularityDesc,
  getRandomGame, getTrendingGames, getLatestNews, getTrendingNews, getCompareGames, getGameTimeline,
  getActivityLogs, getNotifications, markNotificationRead, deleteNotification, getSystemInfo, getSystemVersion,
  getGenreStats, getPriceTierStats, getDeveloperRankings, getReleaseYearTrends
} = require("../controllers/game.controller");
const { authProtect, authorizeRoles } = require("../middleware/auth.middleware");
const { validateGameInput } = require("../middleware/validate.middleware");

const router = express.Router();

// ─── Misc / Info ─────────────────────────────────────────────────────────────
router.get("/random", getRandomGame);
router.get("/trending", getTrendingGames);
router.get("/news/latest", getLatestNews);
router.get("/news/trending", getTrendingNews);
router.get("/compare/games/:id1/:id2", getCompareGames);
router.get("/timeline/game/:appid", getGameTimeline);
router.get("/activity/logs", getActivityLogs);
router.get("/notifications", getNotifications);
router.patch("/notifications/read/:id", markNotificationRead);
router.delete("/notifications/:id", deleteNotification);
router.get("/system/info", getSystemInfo);
router.get("/system/version", getSystemVersion);

// ─── Param-based filters (before /:appid) ────────────────────────────────────
router.get("/genre/:genre", getGamesByGenre);
router.get("/developer/:developer", getGamesByDeveloper);
router.get("/publisher/:publisher", getGamesByPublisher);
router.get("/platform/:platform", getGamesByPlatform);
router.get("/tag/:tag", getGamesByTag);
router.get("/release-year/:year", getGamesByReleaseYear);
router.get("/rating/:rating", getGamesByRating);
router.get("/price/:price", getGamesByPrice);
router.get("/feature/:feature", getGamesByFeature);

// ─── Filter routes ────────────────────────────────────────────────────────────
router.get("/filter/free-to-play", getFreeToPlayGames);
router.get("/filter/paid", getPaidGames);
router.get("/filter/discounted", getDiscountedGames);
router.get("/filter/early-access", getEarlyAccessGames);
router.get("/filter/vr-only", getVrOnlyGames);
router.get("/filter/controller-support", getControllerSupportGames);
router.get("/filter/multiplayer", getMultiplayerGames);
router.get("/filter/singleplayer", getSingleplayerGames);
router.get("/filter/coop", getCoopGames);
router.get("/filter/open-world", getOpenWorldGames);
router.get("/filter/survival", getSurvivalGames);
router.get("/filter/horror", getHorrorGames);
router.get("/filter/anime", getAnimeGames);
router.get("/filter/indie", getIndieGames);
router.get("/filter/top-rated", getTopRatedGames);

// ─── Sort routes ──────────────────────────────────────────────────────────────
router.get("/sort/price-desc", sortGamesPriceDesc);
router.get("/sort/rating-desc", sortGamesRatingDesc);
router.get("/sort/downloads-desc", sortGamesDownloadsDesc);
router.get("/sort/releaseDate-desc", sortGamesReleaseDateDesc);
router.get("/sort/popularity-desc", sortGamesPopularityDesc);

// ─── Exists check ────────────────────────────────────────────────────────────
router.get("/exists/:appid", checkGameExists);

// ─── Core CRUD ───────────────────────────────────────────────────────────────
router.get("/", getAllGames);
router.post("/", validateGameInput, createGame);
router.get("/:appid", getGameByAppId);
router.put("/:appid", validateGameInput, updateGame);
router.patch("/:appid", partialUpdateGame);
router.delete("/:appid", deleteGame);

// ─── Game detail sub-routes ───────────────────────────────────────────────────
router.get("/:appid/summary", getGameSummary);
router.get("/:appid/history", getGameHistory);
router.patch("/:appid/archive", authProtect, authorizeRoles("admin"), archiveGame);
router.patch("/:appid/restore", authProtect, authorizeRoles("admin"), restoreGame);
router.get("/:appid/related", getRelatedGames);
router.get("/:appid/screenshots", getGameScreenshots);
router.get("/:appid/trailers", getGameTrailers);
router.get("/:appid/system-requirements", getSystemRequirements);
router.get("/:appid/dlc", getGameDLC);
router.get("/:appid/achievements", getGameAchievements);
router.get("/:appid/leaderboards", getGameLeaderboards);
router.get("/:appid/updates", getGameUpdates);
router.get("/:appid/news", getGameNews);

// ─── Reviews ─────────────────────────────────────────────────────────────────
router.get("/:appid/reviews", getGameReviews);
router.post("/:appid/reviews", authProtect, addGameReview);
router.patch("/:appid/reviews/:reviewId", authProtect, updateGameReview);
router.delete("/:appid/reviews/:reviewId", authProtect, deleteGameReview);

module.exports = router;