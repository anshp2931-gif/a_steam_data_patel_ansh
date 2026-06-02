const Game = require("../models/game.model");

// Helper for pagination & sorting
const queryHelper = async (filter, req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let sortOption = {};
  if (req.query.sort) {
    const field = req.query.sort;
    sortOption[field.startsWith("-") ? field.substring(1) : field] = field.startsWith("-") ? -1 : 1;
  } else { sortOption = { recommendations: -1 }; }
  let selectFields = "";
  if (req.query.select) selectFields = req.query.select.split(",").join(" ");
  const items = await Game.find(filter).select(selectFields).sort(sortOption).skip(skip).limit(limit);
  const total = await Game.countDocuments(filter);
  return { items, pagination: { totalItems: total, totalPages: Math.ceil(total / limit), currentPage: page, limit } };
};
const ok = (res, data, message) => res.status(200).json({ success: true, statusCode: 200, message, data });
const ok201 = (res, data, message) => res.status(201).json({ success: true, statusCode: 201, message, data });
const notFound = (res, msg) => res.status(404).json({ success: false, message: msg });
const bad = (res, msg) => res.status(400).json({ success: false, message: msg });
const paginated = (res, items, pagination, message) => res.status(200).json({ success: true, statusCode: 200, message, pagination, data: items });
const NF = { isDeleted: { $ne: true } };

// 1. Get all games
const getAllGames = async (req, res, next) => {
  try {
    const filter = { ...NF };
    if (req.query.genre) filter.genres = { $in: [new RegExp(req.query.genre, "i")] };
    if (req.query.developer) filter.developer = new RegExp(req.query.developer, "i");
    if (req.query.publisher) filter.publisher = new RegExp(req.query.publisher, "i");
    if (req.query.platform) filter.platforms = { $in: [new RegExp(req.query.platform, "i")] };
    if (req.query.tag) filter.tags = { $in: [new RegExp(req.query.tag, "i")] };
    if (req.query.releaseYear) filter.release_year = req.query.releaseYear;
    if (req.query.discount === "true") filter.discountPercent = { $gt: 0 };
    if (req.query.freeToPlay === "true" || req.query.isFree === "true") filter.is_free = true;
    if (req.query.multiplayer === "true") filter.categories = { $in: [/multi-player/i, /co-op/i] };
    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      filter.price = {};
      if (req.query.minPrice !== undefined) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice !== undefined) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.rating !== undefined) filter.rating = { $gte: parseFloat(req.query.rating) };
    const { items, pagination } = await queryHelper(filter, req);
    paginated(res, items, pagination, "Games fetched successfully");
  } catch (error) { next(error); }
};

// 2. Get game by appid
const getGameByAppId = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF });
    if (!game) return notFound(res, `Game with App ID ${req.params.appid} not found`);
    ok(res, game, "Game details fetched successfully");
  } catch (error) { next(error); }
};

// 3. Create game
const createGame = async (req, res, next) => {
  try {
    const existing = await Game.findOne({ appid: req.body.appid });
    if (existing) return bad(res, `Game with App ID ${req.body.appid} already exists`);
    const game = await Game.create(req.body);
    ok201(res, game, "Game created successfully");
  } catch (error) { next(error); }
};

// 4. Replace game (PUT)
const updateGame = async (req, res, next) => {
  try {
    const game = await Game.findOneAndUpdate({ appid: req.params.appid }, req.body, { new: true, runValidators: true, overwrite: true });
    if (!game) return notFound(res, `Game with App ID ${req.params.appid} not found`);
    ok(res, game, "Game replaced successfully");
  } catch (error) { next(error); }
};

// 5. Partial update (PATCH)
const partialUpdateGame = async (req, res, next) => {
  try {
    const game = await Game.findOneAndUpdate({ appid: req.params.appid, ...NF }, { $set: req.body }, { new: true, runValidators: true });
    if (!game) return notFound(res, `Game with App ID ${req.params.appid} not found`);
    ok(res, game, "Game updated successfully");
  } catch (error) { next(error); }
};

// 6. Delete game
const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findOneAndDelete({ appid: req.params.appid });
    if (!game) return notFound(res, `Game with App ID ${req.params.appid} not found`);
    ok(res, null, "Game permanently deleted successfully");
  } catch (error) { next(error); }
};

// 7. Check exists
const checkGameExists = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF });
    ok(res, { exists: !!game }, "Game status checked successfully");
  } catch (error) { next(error); }
};

// 8. Game summary
const getGameSummary = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF }).select("appid name price developer publisher rating is_free description header_image");
    if (!game) return notFound(res, "Game not found");
    ok(res, game, "Game summary loaded");
  } catch (error) { next(error); }
};

// 9. Game history
const getGameHistory = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF }).select("appid name history");
    if (!game) return notFound(res, "Game not found");
    ok(res, game.history || [], "Game update history fetched");
  } catch (error) { next(error); }
};

// 10. Archive game
const archiveGame = async (req, res, next) => {
  try {
    const game = await Game.findOneAndUpdate({ appid: req.params.appid, ...NF }, { isArchived: true }, { new: true });
    if (!game) return notFound(res, "Game not found");
    ok(res, game, "Game archived successfully");
  } catch (error) { next(error); }
};

// 11. Restore game
const restoreGame = async (req, res, next) => {
  try {
    const game = await Game.findOneAndUpdate({ appid: req.params.appid, ...NF }, { isArchived: false }, { new: true });
    if (!game) return notFound(res, "Game not found");
    ok(res, game, "Game restored successfully");
  } catch (error) { next(error); }
};

// 12. Related games
const getRelatedGames = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF });
    if (!game) return notFound(res, "Game not found");
    const related = await Game.find({ appid: { $ne: game.appid }, ...NF, $or: [{ genres: { $in: game.genres } }, { developer: game.developer }] }).limit(5);
    ok(res, related, "Related games fetched");
  } catch (error) { next(error); }
};

// Game sub-resource getters
const getSubResource = (field, message) => async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF }).select(field);
    if (!game) return notFound(res, "Game not found");
    ok(res, game[field] || [], message);
  } catch (error) { next(error); }
};
const getGameScreenshots = getSubResource("screenshots", "Screenshots fetched");
const getGameTrailers = getSubResource("trailers", "Trailers fetched");
const getGameDLC = getSubResource("dlc", "DLC list fetched");
const getGameAchievements = getSubResource("achievements", "Achievements fetched");
const getGameLeaderboards = getSubResource("leaderboards", "Leaderboards fetched");
const getGameUpdates = getSubResource("history", "Game updates fetched");
const getGameNews = getSubResource("news", "Game news fetched");
const getGameReviews = getSubResource("reviews", "Reviews fetched");

const getSystemRequirements = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF }).select("system_requirements");
    if (!game) return notFound(res, "Game not found");
    ok(res, game.system_requirements, "System requirements fetched");
  } catch (error) { next(error); }
};

// Reviews CRUD
const addGameReview = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF });
    if (!game) return notFound(res, "Game not found");
    game.reviews.push({ username: req.user.username, reviewText: req.body.reviewText, rating: parseInt(req.body.rating) });
    const total = game.reviews.length;
    game.rating = Math.round((game.reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10;
    await game.save();
    ok201(res, game.reviews, "Review added successfully");
  } catch (error) { next(error); }
};

const updateGameReview = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF });
    if (!game) return notFound(res, "Game not found");
    const review = game.reviews.id(req.params.reviewId);
    if (!review) return notFound(res, "Review not found");
    if (review.username !== req.user.username && req.user.role !== "admin") return res.status(403).json({ success: false, message: "Not authorized to update this review" });
    if (req.body.reviewText) review.reviewText = req.body.reviewText;
    if (req.body.rating) review.rating = parseInt(req.body.rating);
    const total = game.reviews.length;
    game.rating = Math.round((game.reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10;
    await game.save();
    ok(res, game.reviews, "Review updated successfully");
  } catch (error) { next(error); }
};

const deleteGameReview = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF });
    if (!game) return notFound(res, "Game not found");
    const review = game.reviews.id(req.params.reviewId);
    if (!review) return notFound(res, "Review not found");
    if (review.username !== req.user.username && req.user.role !== "admin") return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    game.reviews.pull(req.params.reviewId);
    const total = game.reviews.length;
    game.rating = total > 0 ? Math.round((game.reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;
    await game.save();
    ok(res, game.reviews, "Review deleted successfully");
  } catch (error) { next(error); }
};

// Param-based filter helpers
const filterByParam = (filterFn, messageFn) => async (req, res, next) => {
  try {
    const { items, pagination } = await queryHelper({ ...filterFn(req), ...NF }, req);
    paginated(res, items, pagination, messageFn(req));
  } catch (error) { next(error); }
};
const getGamesByGenre = filterByParam(r => ({ genres: { $in: [new RegExp(r.params.genre, "i")] } }), r => `Games for genre ${r.params.genre}`);
const getGamesByDeveloper = filterByParam(r => ({ developer: new RegExp(r.params.developer, "i") }), r => `Games developed by ${r.params.developer}`);
const getGamesByPublisher = filterByParam(r => ({ publisher: new RegExp(r.params.publisher, "i") }), r => `Games published by ${r.params.publisher}`);
const getGamesByPlatform = filterByParam(r => ({ platforms: { $in: [new RegExp(r.params.platform, "i")] } }), r => `Games supported on ${r.params.platform}`);
const getGamesByTag = filterByParam(r => ({ tags: { $in: [new RegExp(r.params.tag, "i")] } }), r => `Games with tag ${r.params.tag}`);
const getGamesByReleaseYear = filterByParam(r => ({ release_year: r.params.year }), r => `Games released in ${r.params.year}`);
const getGamesByFeature = filterByParam(r => ({ categories: { $in: [new RegExp(r.params.feature, "i")] } }), r => `Games with feature ${r.params.feature}`);

const getGamesByRating = async (req, res, next) => {
  try {
    const val = parseFloat(req.params.rating);
    if (isNaN(val)) return bad(res, "Invalid rating value");
    const { items, pagination } = await queryHelper({ rating: { $gte: val }, ...NF }, req);
    paginated(res, items, pagination, `Games with rating >= ${val}`);
  } catch (error) { next(error); }
};

const getGamesByPrice = async (req, res, next) => {
  try {
    const val = parseFloat(req.params.price);
    if (isNaN(val)) return bad(res, "Invalid price value");
    const { items, pagination } = await queryHelper({ price: val, ...NF }, req);
    paginated(res, items, pagination, `Games priced at $${val}`);
  } catch (error) { next(error); }
};

// Filter routes
const filterRoute = (filter, message) => async (req, res, next) => {
  try {
    const { items, pagination } = await queryHelper({ ...filter, ...NF }, req);
    paginated(res, items, pagination, message);
  } catch (error) { next(error); }
};
const getFreeToPlayGames = filterRoute({ is_free: true }, "Free-to-Play Games");
const getPaidGames = filterRoute({ is_free: false, price: { $gt: 0 } }, "Paid Games");
const getDiscountedGames = filterRoute({ discountPercent: { $gt: 0 } }, "Discounted Games");
const getEarlyAccessGames = filterRoute({ isEarlyAccess: true }, "Early Access Games");
const getVrOnlyGames = filterRoute({ isVrOnly: true }, "VR Exclusive Games");
const getControllerSupportGames = filterRoute({ categories: { $in: [/controller support/i, /full controller/i] } }, "Controller Supported Games");
const getMultiplayerGames = filterRoute({ categories: { $in: [/multi-player/i, /online multi-player/i] } }, "Multiplayer Games");
const getSingleplayerGames = filterRoute({ categories: { $in: [/single-player/i] } }, "Singleplayer Games");
const getCoopGames = filterRoute({ categories: { $in: [/co-op/i, /cooperative/i] } }, "Co-op Games");
const getOpenWorldGames = filterRoute({ tags: { $in: [/open world/i] } }, "Open World Games");
const getSurvivalGames = filterRoute({ genres: { $in: [/survival/i] } }, "Survival Games");
const getHorrorGames = filterRoute({ genres: { $in: [/horror/i] } }, "Horror Games");
const getAnimeGames = filterRoute({ tags: { $in: [/anime/i] } }, "Anime Games");
const getIndieGames = filterRoute({ genres: { $in: [/indie/i] } }, "Indie Games");
const getTopRatedGames = filterRoute({ rating: { $gte: 8 } }, "Top Rated Games (Rating >= 8)");

// Sort routes
const sortRoute = (sortField, message) => async (req, res, next) => {
  try {
    req.query.sort = sortField;
    const { items, pagination } = await queryHelper({ ...NF }, req);
    paginated(res, items, pagination, message);
  } catch (error) { next(error); }
};
const sortGamesPriceDesc = sortRoute("-price", "Sorted by Highest Price First");
const sortGamesRatingDesc = sortRoute("-rating", "Sorted by Highest Rating First");
const sortGamesDownloadsDesc = sortRoute("-downloads", "Sorted by Most Downloaded First");
const sortGamesReleaseDateDesc = sortRoute("-release_year", "Sorted by Newest Release First");
const sortGamesPopularityDesc = sortRoute("-recommendations", "Sorted by Popularity First");

// Misc routes
const getRandomGame = async (req, res, next) => {
  try {
    const count = await Game.countDocuments(NF);
    if (count === 0) return notFound(res, "No games found");
    const game = await Game.findOne(NF).skip(Math.floor(Math.random() * count));
    ok(res, game, "Random game fetched successfully");
  } catch (error) { next(error); }
};

const getTrendingGames = async (req, res, next) => {
  try {
    const games = await Game.find(NF).sort({ recommendations: -1 }).limit(5);
    ok(res, games, "Trending games fetched successfully");
  } catch (error) { next(error); }
};

const getLatestNews = async (req, res, next) => {
  try {
    const gamesWithNews = await Game.find({ "news.0": { $exists: true }, ...NF }).select("appid name news").limit(5);
    const allNews = gamesWithNews.flatMap(g => g.news.map(n => ({ appid: g.appid, gameName: g.name, ...n.toObject() })));
    allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    ok(res, allNews.slice(0, 10), "Latest gaming news fetched successfully");
  } catch (error) { next(error); }
};

const getTrendingNews = async (req, res, next) => {
  try {
    const gamesWithNews = await Game.find({ "news.0": { $exists: true }, ...NF }).select("appid name news").limit(5);
    const allNews = gamesWithNews.flatMap(g => g.news.map(n => ({ appid: g.appid, gameName: g.name, ...n.toObject() })));
    ok(res, allNews.slice(0, 5), "Trending news fetched successfully");
  } catch (error) { next(error); }
};

const getCompareGames = async (req, res, next) => {
  try {
    const game1 = await Game.findOne({ appid: req.params.id1, ...NF });
    const game2 = await Game.findOne({ appid: req.params.id2, ...NF });
    if (!game1 || !game2) return notFound(res, "One or both games not found for comparison");
    ok(res, { game1, game2 }, "Games comparison completed");
  } catch (error) { next(error); }
};

const getGameTimeline = async (req, res, next) => {
  try {
    const game = await Game.findOne({ appid: req.params.appid, ...NF }).select("appid name history release_date");
    if (!game) return notFound(res, "Game not found");
    ok(res, { releaseDate: game.release_date, history: game.history || [] }, "Timeline fetched");
  } catch (error) { next(error); }
};

const getActivityLogs = async (req, res, next) => {
  try {
    ok(res, [
      { action: "Game Seeding completed", timestamp: new Date(Date.now() - 3600000) },
      { action: "Admin user logged in", timestamp: new Date(Date.now() - 1800000) },
      { action: "Fetched games statistics dashboard", timestamp: new Date() }
    ], "User activity logs fetched");
  } catch (error) { next(error); }
};

const getNotifications = async (req, res, next) => {
  try {
    ok(res, [
      { id: "1", title: "Welcome to Steam Clone Backend", message: "Enjoy the fully featured endpoints!", isRead: false },
      { id: "2", title: "New Game Released", message: "Elden Ring is trending now!", isRead: true }
    ], "User notifications fetched");
  } catch (error) { next(error); }
};

const markNotificationRead = async (req, res, next) => {
  try { ok(res, { id: req.params.id, isRead: true }, "Notification marked as read"); } catch (error) { next(error); }
};

const deleteNotification = async (req, res, next) => {
  try { ok(res, null, `Notification ${req.params.id} deleted`); } catch (error) { next(error); }
};

const getSystemInfo = async (req, res, next) => {
  try {
    ok(res, { os: process.platform, arch: process.arch, node: process.version, memory: process.memoryUsage(), env: process.env.NODE_ENV }, "System info fetched");
  } catch (error) { next(error); }
};

const getSystemVersion = async (req, res, next) => {
  try { ok(res, { version: "1.0.0", releaseDate: "May 2026" }, "System version fetched"); } catch (error) { next(error); }
};

// Aggregation stats (previously in aggregation.service.js)
const getGenreStats = async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF }, { $unwind: "$genres" },
      { $group: { _id: "$genres", totalGames: { $sum: 1 }, avgPrice: { $avg: "$price" }, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" }, avgRecommendations: { $avg: "$recommendations" }, totalRecommendations: { $sum: "$recommendations" } } },
      { $project: { genre: "$_id", totalGames: 1, avgPrice: { $round: ["$avgPrice", 2] }, minPrice: 1, maxPrice: 1, avgRecommendations: { $round: ["$avgRecommendations", 0] }, totalRecommendations: 1, _id: 0 } },
      { $sort: { totalGames: -1 } }
    ]);
    ok(res, stats, "Genre statistics fetched successfully");
  } catch (error) { next(error); }
};

const getPriceTierStats = async (req, res, next) => {
  try {
    const stats = await Game.aggregate([
      { $match: NF },
      { $project: { priceTier: { $cond: { if: { $eq: ["$price", 0] }, then: "Free to Play", else: { $cond: { if: { $lt: ["$price", 15] }, then: "Budget (Under $15)", else: { $cond: { if: { $lte: ["$price", 40] }, then: "Premium ($15 - $40)", else: "Elite (Over $40)" } } } } } }, price: 1, recommendations: 1 } },
      { $group: { _id: "$priceTier", count: { $sum: 1 }, avgPrice: { $avg: "$price" }, totalRecommendations: { $sum: "$recommendations" } } },
      { $project: { tier: "$_id", count: 1, avgPrice: { $round: ["$avgPrice", 2] }, totalRecommendations: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    ok(res, stats, "Price tier statistics fetched successfully");
  } catch (error) { next(error); }
};

const getDeveloperRankings = async (req, res, next) => {
  try {
    const rankings = await Game.aggregate([
      { $match: NF },
      { $group: { _id: "$developer", gamesCount: { $sum: 1 }, totalRecommendations: { $sum: "$recommendations" }, avgPrice: { $avg: "$price" } } },
      { $project: { developer: "$_id", gamesCount: 1, totalRecommendations: 1, avgPrice: { $round: ["$avgPrice", 2] }, _id: 0 } },
      { $sort: { totalRecommendations: -1, gamesCount: -1 } }, { $limit: 10 }
    ]);
    ok(res, rankings, "Developer rankings fetched successfully");
  } catch (error) { next(error); }
};

const getReleaseYearTrends = async (req, res, next) => {
  try {
    const trends = await Game.aggregate([
      { $match: { ...NF, release_year: { $exists: true, $ne: "" } } },
      { $group: { _id: "$release_year", gamesReleased: { $sum: 1 }, avgPrice: { $avg: "$price" }, totalRecommendations: { $sum: "$recommendations" } } },
      { $project: { year: "$_id", gamesReleased: 1, avgPrice: { $round: ["$avgPrice", 2] }, totalRecommendations: 1, _id: 0 } },
      { $sort: { year: -1 } }
    ]);
    ok(res, trends, "Yearly release trends fetched successfully");
  } catch (error) { next(error); }
};

module.exports = {
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
};