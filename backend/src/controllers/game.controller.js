const Game = require("../models/game.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Helper to handle pagination and sorting on queries
const queryHelper = async (filter, req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Sorting
  let sortOption = {};
  if (req.query.sort) {
    const field = req.query.sort;
    if (field.startsWith("-")) {
      sortOption[field.substring(1)] = -1;
    } else {
      sortOption[field] = 1;
    }
  } else {
    sortOption = { recommendations: -1 }; // Default sort by popularity
  }

  // Field selection / projection
  let selectFields = "";
  if (req.query.select) {
    selectFields = req.query.select.split(",").join(" ");
  }

  const items = await Game.find(filter)
    .select(selectFields)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Game.countDocuments(filter);

  return {
    items,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit
    }
  };
};

// 1. Fetch all Steam games with advanced filters, pagination & combinations
const getAllGames = asyncHandler(async (req, res) => {
  const filter = { isDeleted: { $ne: true } };

  // Apply Query Filters
  if (req.query.genre) filter.genres = { $in: [new RegExp(req.query.genre, "i")] };
  if (req.query.developer) filter.developer = new RegExp(req.query.developer, "i");
  if (req.query.publisher) filter.publisher = new RegExp(req.query.publisher, "i");
  if (req.query.platform) filter.platforms = { $in: [new RegExp(req.query.platform, "i")] };
  if (req.query.tag) filter.tags = { $in: [new RegExp(req.query.tag, "i")] };
  if (req.query.releaseYear) filter.release_year = req.query.releaseYear;
  if (req.query.discount === "true") filter.discountPercent = { $gt: 0 };
  if (req.query.freeToPlay === "true" || req.query.isFree === "true") filter.is_free = true;
  if (req.query.multiplayer === "true") filter.categories = { $in: [/multi-player/i, /co-op/i] };

  // Numerical Range Filters
  if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
    filter.price = {};
    if (req.query.minPrice !== undefined) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice !== undefined) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  if (req.query.rating !== undefined) {
    filter.rating = { $gte: parseFloat(req.query.rating) };
  }

  const { items, pagination } = await queryHelper(filter, req);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Games fetched successfully",
    pagination,
    data: items
  });
});

// 2. Fetch single game by appid
const getGameByAppId = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } });
  if (!game) {
    throw new ApiError(404, `Game with App ID ${req.params.appid} not found`);
  }
  res.status(200).json(new ApiResponse(200, game, "Game details fetched successfully"));
});

// 3. Create a new game entry
const createGame = asyncHandler(async (req, res) => {
  const existing = await Game.findOne({ appid: req.body.appid });
  if (existing) {
    throw new ApiError(400, `Game with App ID ${req.body.appid} already exists`);
  }
  const game = await Game.create(req.body);
  res.status(201).json(new ApiResponse(201, game, "Game created successfully"));
});

// 4. Replace entire game record (PUT)
const updateGame = asyncHandler(async (req, res) => {
  const game = await Game.findOneAndUpdate(
    { appid: req.params.appid },
    req.body,
    { new: true, runValidators: true, overwrite: true }
  );
  if (!game) {
    throw new ApiError(404, `Game with App ID ${req.params.appid} not found`);
  }
  res.status(200).json(new ApiResponse(200, game, "Game replaced successfully"));
});

// 5. Partially update game details (PATCH)
const partialUpdateGame = asyncHandler(async (req, res) => {
  const game = await Game.findOneAndUpdate(
    { appid: req.params.appid, isDeleted: { $ne: true } },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!game) {
    throw new ApiError(404, `Game with App ID ${req.params.appid} not found`);
  }
  res.status(200).json(new ApiResponse(200, game, "Game updated successfully"));
});

// 6. Permanently delete a game
const deleteGame = asyncHandler(async (req, res) => {
  const game = await Game.findOneAndDelete({ appid: req.params.appid });
  if (!game) {
    throw new ApiError(404, `Game with App ID ${req.params.appid} not found`);
  }
  res.status(200).json(new ApiResponse(200, null, "Game permanently deleted successfully"));
});

// 7. Check if game exists
const checkGameExists = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } });
  res.status(200).json(new ApiResponse(200, { exists: !!game }, "Game status checked successfully"));
});

// 8. Get summarized details of a game
const getGameSummary = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("appid name price developer publisher rating is_free description header_image");
  if (!game) {
    throw new ApiError(404, "Game not found");
  }
  res.status(200).json(new ApiResponse(200, game, "Game summary loaded"));
});

// 9. Retrieve game update history
const getGameHistory = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("appid name history");
  if (!game) {
    throw new ApiError(404, "Game not found");
  }
  res.status(200).json(new ApiResponse(200, game.history || [], "Game update history fetched"));
});

// 10. Archive a game entry (soft delete archive)
const archiveGame = asyncHandler(async (req, res) => {
  const game = await Game.findOneAndUpdate(
    { appid: req.params.appid, isDeleted: { $ne: true } },
    { isArchived: true },
    { new: true }
  );
  if (!game) {
    throw new ApiError(404, "Game not found");
  }
  res.status(200).json(new ApiResponse(200, game, "Game archived successfully"));
});

// 11. Restore archived game
const restoreGame = asyncHandler(async (req, res) => {
  const game = await Game.findOneAndUpdate(
    { appid: req.params.appid, isDeleted: { $ne: true } },
    { isArchived: false },
    { new: true }
  );
  if (!game) {
    throw new ApiError(404, "Game not found");
  }
  res.status(200).json(new ApiResponse(200, game, "Game restored successfully"));
});

// 12. Fetch related game recommendations
const getRelatedGames = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } });
  if (!game) {
    throw new ApiError(404, "Game not found");
  }
  const related = await Game.find({
    appid: { $ne: game.appid },
    isDeleted: { $ne: true },
    $or: [
      { genres: { $in: game.genres } },
      { developer: game.developer }
    ]
  }).limit(5);
  res.status(200).json(new ApiResponse(200, related, "Related games fetched"));
});

// Game Info Sub-routes (Screenshots, Trailers, system-requirements, DLC, Achievements, Leaderboards, updates, news)
const getGameScreenshots = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("screenshots");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.screenshots || [], "Screenshots fetched"));
});

const getGameTrailers = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("trailers");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.trailers || [], "Trailers fetched"));
});

const getSystemRequirements = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("system_requirements");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.system_requirements, "System requirements fetched"));
});

const getGameDLC = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("dlc");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.dlc || [], "DLC list fetched"));
});

const getGameAchievements = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("achievements");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.achievements || [], "Achievements fetched"));
});

const getGameLeaderboards = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("leaderboards");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.leaderboards || [], "Leaderboards fetched"));
});

const getGameUpdates = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("history");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.history || [], "Game updates fetched"));
});

const getGameNews = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("news");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.news || [], "Game news fetched"));
});

// Reviews controller actions
const getGameReviews = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("reviews");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, game.reviews || [], "Reviews fetched"));
});

const addGameReview = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } });
  if (!game) throw new ApiError(404, "Game not found");

  const newReview = {
    username: req.user.username,
    reviewText: req.body.reviewText,
    rating: parseInt(req.body.rating)
  };

  game.reviews.push(newReview);
  // Re-calculate average rating
  const totalReviews = game.reviews.length;
  const ratingSum = game.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  game.rating = Math.round((ratingSum / totalReviews) * 10) / 10;

  await game.save();
  res.status(201).json(new ApiResponse(201, game.reviews, "Review added successfully"));
});

const updateGameReview = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } });
  if (!game) throw new ApiError(404, "Game not found");

  const review = game.reviews.id(req.params.reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  if (review.username !== req.user.username && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to update this review");
  }

  if (req.body.reviewText) review.reviewText = req.body.reviewText;
  if (req.body.rating) review.rating = parseInt(req.body.rating);

  const totalReviews = game.reviews.length;
  const ratingSum = game.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  game.rating = Math.round((ratingSum / totalReviews) * 10) / 10;

  await game.save();
  res.status(200).json(new ApiResponse(200, game.reviews, "Review updated successfully"));
});

const deleteGameReview = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } });
  if (!game) throw new ApiError(404, "Game not found");

  const review = game.reviews.id(req.params.reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  if (review.username !== req.user.username && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  game.reviews.pull(req.params.reviewId);

  const totalReviews = game.reviews.length;
  if (totalReviews > 0) {
    const ratingSum = game.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    game.rating = Math.round((ratingSum / totalReviews) * 10) / 10;
  } else {
    game.rating = 0;
  }

  await game.save();
  res.status(200).json(new ApiResponse(200, game.reviews, "Review deleted successfully"));
});

// Route parameter functions
const getGamesByGenre = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ genres: { $in: [new RegExp(req.params.genre, "i")] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games for genre ${req.params.genre}`, pagination, data: items });
});

const getGamesByDeveloper = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ developer: new RegExp(req.params.developer, "i"), isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games developed by ${req.params.developer}`, pagination, data: items });
});

const getGamesByPublisher = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ publisher: new RegExp(req.params.publisher, "i"), isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games published by ${req.params.publisher}`, pagination, data: items });
});

const getGamesByPlatform = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ platforms: { $in: [new RegExp(req.params.platform, "i")] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games supported on ${req.params.platform}`, pagination, data: items });
});

const getGamesByTag = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ tags: { $in: [new RegExp(req.params.tag, "i")] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games with tag ${req.params.tag}`, pagination, data: items });
});

const getGamesByReleaseYear = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ release_year: req.params.year, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games released in ${req.params.year}`, pagination, data: items });
});

const getGamesByRating = asyncHandler(async (req, res) => {
  const ratingVal = parseFloat(req.params.rating);
  if (isNaN(ratingVal)) throw new ApiError(400, "Invalid rating value");
  const { items, pagination } = await queryHelper({ rating: { $gte: ratingVal }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games with rating >= ${ratingVal}`, pagination, data: items });
});

const getGamesByPrice = asyncHandler(async (req, res) => {
  const priceVal = parseFloat(req.params.price);
  if (isNaN(priceVal)) throw new ApiError(400, "Invalid price value");
  const { items, pagination } = await queryHelper({ price: priceVal, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games priced at $${priceVal}`, pagination, data: items });
});

const getGamesByFeature = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ categories: { $in: [new RegExp(req.params.feature, "i")] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: `Games with feature ${req.params.feature}`, pagination, data: items });
});

// Filtering controller actions
const getFreeToPlayGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ is_free: true, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Free-to-Play Games", pagination, data: items });
});

const getPaidGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ is_free: false, price: { $gt: 0 }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Paid Games", pagination, data: items });
});

const getDiscountedGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ discountPercent: { $gt: 0 }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Discounted Games", pagination, data: items });
});

const getEarlyAccessGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ isEarlyAccess: true, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Early Access Games", pagination, data: items });
});

const getVrOnlyGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ isVrOnly: true, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "VR Exclusive Games", pagination, data: items });
});

const getControllerSupportGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ categories: { $in: [/controller support/i, /full controller/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Controller Supported Games", pagination, data: items });
});

const getMultiplayerGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ categories: { $in: [/multi-player/i, /online multi-player/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Multiplayer Games", pagination, data: items });
});

const getSingleplayerGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ categories: { $in: [/single-player/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Singleplayer Games", pagination, data: items });
});

const getCoopGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ categories: { $in: [/co-op/i, /cooperative/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Co-op Games", pagination, data: items });
});

const getOpenWorldGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ tags: { $in: [/open world/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Open World Games", pagination, data: items });
});

const getSurvivalGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ genres: { $in: [/survival/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Survival Games", pagination, data: items });
});

const getHorrorGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ genres: { $in: [/horror/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Horror Games", pagination, data: items });
});

const getAnimeGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ tags: { $in: [/anime/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Anime Games", pagination, data: items });
});

const getIndieGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ genres: { $in: [/indie/i] }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Indie Games", pagination, data: items });
});

const getTopRatedGames = asyncHandler(async (req, res) => {
  const { items, pagination } = await queryHelper({ rating: { $gte: 8 }, isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Top Rated Games (Rating >= 8)", pagination, data: items });
});

// Sorting controller actions
const sortGamesPriceDesc = asyncHandler(async (req, res) => {
  req.query.sort = "-price";
  const { items, pagination } = await queryHelper({ isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Sorted by Highest Price First", pagination, data: items });
});

const sortGamesRatingDesc = asyncHandler(async (req, res) => {
  req.query.sort = "-rating";
  const { items, pagination } = await queryHelper({ isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Sorted by Highest Rating First", pagination, data: items });
});

const sortGamesDownloadsDesc = asyncHandler(async (req, res) => {
  req.query.sort = "-downloads";
  const { items, pagination } = await queryHelper({ isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Sorted by Most Downloaded First", pagination, data: items });
});

const sortGamesReleaseDateDesc = asyncHandler(async (req, res) => {
  req.query.sort = "-release_year";
  const { items, pagination } = await queryHelper({ isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Sorted by Newest Release First", pagination, data: items });
});

const sortGamesPopularityDesc = asyncHandler(async (req, res) => {
  req.query.sort = "-recommendations";
  const { items, pagination } = await queryHelper({ isDeleted: { $ne: true } }, req);
  res.status(200).json({ success: true, statusCode: 200, message: "Sorted by Popularity First", pagination, data: items });
});

// Advanced game routes
const getRandomGame = asyncHandler(async (req, res) => {
  const count = await Game.countDocuments({ isDeleted: { $ne: true } });
  if (count === 0) throw new ApiError(404, "No games found");
  const randomIdx = Math.floor(Math.random() * count);
  const randomGame = await Game.findOne({ isDeleted: { $ne: true } }).skip(randomIdx);
  res.status(200).json(new ApiResponse(200, randomGame, "Random game fetched successfully"));
});

const getTrendingGames = asyncHandler(async (req, res) => {
  const trending = await Game.find({ isDeleted: { $ne: true } }).sort({ recommendations: -1 }).limit(5);
  res.status(200).json(new ApiResponse(200, trending, "Trending games fetched successfully"));
});

const getLatestNews = asyncHandler(async (req, res) => {
  const gamesWithNews = await Game.find({ "news.0": { $exists: true }, isDeleted: { $ne: true } }).select("appid name news").limit(5);
  const allNews = gamesWithNews.flatMap(g => g.news.map(n => ({ appid: g.appid, gameName: g.name, ...n.toObject() })));
  allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.status(200).json(new ApiResponse(200, allNews.slice(0, 10), "Latest gaming news fetched successfully"));
});

const getTrendingNews = asyncHandler(async (req, res) => {
  // Mock news list
  const gamesWithNews = await Game.find({ "news.0": { $exists: true }, isDeleted: { $ne: true } }).select("appid name news").limit(5);
  const allNews = gamesWithNews.flatMap(g => g.news.map(n => ({ appid: g.appid, gameName: g.name, ...n.toObject() })));
  res.status(200).json(new ApiResponse(200, allNews.slice(0, 5), "Trending news fetched successfully"));
});

const getCompareGames = asyncHandler(async (req, res) => {
  const { id1, id2 } = req.params;
  const game1 = await Game.findOne({ appid: id1, isDeleted: { $ne: true } });
  const game2 = await Game.findOne({ appid: id2, isDeleted: { $ne: true } });

  if (!game1 || !game2) throw new ApiError(404, "One or both games not found for comparison");

  res.status(200).json(new ApiResponse(200, { game1, game2 }, "Games comparison completed"));
});

const getGameTimeline = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ appid: req.params.appid, isDeleted: { $ne: true } }).select("appid name history release_date");
  if (!game) throw new ApiError(404, "Game not found");
  res.status(200).json(new ApiResponse(200, { releaseDate: game.release_date, history: game.history || [] }, "Timeline fetched"));
});

const getActivityLogs = asyncHandler(async (req, res) => {
  // Return some mock activity logs
  const logs = [
    { action: "Game Seeding completed", timestamp: new Date(Date.now() - 3600000) },
    { action: "Admin user logged in", timestamp: new Date(Date.now() - 1800000) },
    { action: "Fetched games statistics dashboard", timestamp: new Date() }
  ];
  res.status(200).json(new ApiResponse(200, logs, "User activity logs fetched"));
});

const getNotifications = asyncHandler(async (req, res) => {
  const mockNotifications = [
    { id: "1", title: "Welcome to Steam Clone Backend", message: "Enjoy the fully featured endpoints!", isRead: false },
    { id: "2", title: "New Game Released", message: "Elden Ring is trending now!", isRead: true }
  ];
  res.status(200).json(new ApiResponse(200, mockNotifications, "User notifications fetched"));
});

const markNotificationRead = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { id: req.params.id, isRead: true }, "Notification marked as read"));
});

const deleteNotification = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, `Notification ${req.params.id} deleted`));
});

const getSystemInfo = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {
    os: process.platform,
    arch: process.arch,
    node: process.version,
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV
  }, "System info fetched"));
});

const getSystemVersion = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { version: "1.0.0", releaseDate: "May 2026" }, "System version fetched"));
});

// Old controller properties (for compatibility)
const getGenreStats = async (req, res, next) => {
  try {
    const aggregationService = require("../services/aggregation.service");
    const stats = await aggregationService.getGenreStats();
    res.status(200).json(new ApiResponse(200, stats, "Genre statistics fetched successfully"));
  } catch (error) { next(error); }
};

const getPriceTierStats = async (req, res, next) => {
  try {
    const aggregationService = require("../services/aggregation.service");
    const stats = await aggregationService.getPriceTierStats();
    res.status(200).json(new ApiResponse(200, stats, "Price tier statistics fetched successfully"));
  } catch (error) { next(error); }
};

const getDeveloperRankings = async (req, res, next) => {
  try {
    const aggregationService = require("../services/aggregation.service");
    const rankings = await aggregationService.getDeveloperRankings();
    res.status(200).json(new ApiResponse(200, rankings, "Developer rankings fetched successfully"));
  } catch (error) { next(error); }
};

const getReleaseYearTrends = async (req, res, next) => {
  try {
    const aggregationService = require("../services/aggregation.service");
    const trends = await aggregationService.getReleaseYearTrends();
    res.status(200).json(new ApiResponse(200, trends, "Yearly release trends fetched successfully"));
  } catch (error) { next(error); }
};

module.exports = {
  createGame,
  getAllGames,
  getGameByAppId,
  updateGame,
  partialUpdateGame,
  deleteGame,
  checkGameExists,
  getGameSummary,
  getGameHistory,
  archiveGame,
  restoreGame,
  getRelatedGames,
  getGameScreenshots,
  getGameTrailers,
  getGameReviews,
  addGameReview,
  updateGameReview,
  deleteGameReview,
  getSystemRequirements,
  getGameDLC,
  getGameAchievements,
  getGameLeaderboards,
  getGameUpdates,
  getGameNews,
  getGamesByGenre,
  getGamesByDeveloper,
  getGamesByPublisher,
  getGamesByPlatform,
  getGamesByTag,
  getGamesByReleaseYear,
  getGamesByRating,
  getGamesByPrice,
  getGamesByFeature,
  getFreeToPlayGames,
  getPaidGames,
  getDiscountedGames,
  getEarlyAccessGames,
  getVrOnlyGames,
  getControllerSupportGames,
  getMultiplayerGames,
  getSingleplayerGames,
  getCoopGames,
  getOpenWorldGames,
  getSurvivalGames,
  getHorrorGames,
  getAnimeGames,
  getIndieGames,
  getTopRatedGames,
  sortGamesPriceDesc,
  sortGamesRatingDesc,
  sortGamesDownloadsDesc,
  sortGamesReleaseDateDesc,
  sortGamesPopularityDesc,
  getRandomGame,
  getTrendingGames,
  getLatestNews,
  getTrendingNews,
  getCompareGames,
  getGameTimeline,
  getActivityLogs,
  getNotifications,
  markNotificationRead,
  deleteNotification,
  getSystemInfo,
  getSystemVersion,
  getGenreStats,
  getPriceTierStats,
  getDeveloperRankings,
  getReleaseYearTrends
};