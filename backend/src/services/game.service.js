const Game = require("../models/game.model");
const { buildGameFilter } = require("../utils/filterBuilder");
const { getPaginationOptions, getPaginationMetadata } = require("../utils/pagination");
const ApiError = require("../utils/ApiError");

/**
 * Game Business Logic Service
 */
const createGame = async (gameData) => {
  const existingGame = await Game.findOne({ appid: gameData.appid });
  if (existingGame) {
    throw new ApiError(400, `Game with App ID ${gameData.appid} already exists.`);
  }

  const game = await Game.create(gameData);
  return game;
};

const getGames = async (queryParams) => {
  const filter = buildGameFilter(queryParams);
  const { page, limit, skip } = getPaginationOptions(queryParams);

  // Sorting parser: ?sort=price,-recommendations (comma separated fields)
  let sortOption = {};
  if (queryParams.sort) {
    const sortFields = queryParams.sort.split(",");
    sortFields.forEach((field) => {
      let order = 1;
      let fieldName = field.trim();
      if (fieldName.startsWith("-")) {
        order = -1;
        fieldName = fieldName.substring(1);
      }
      sortOption[fieldName] = order;
    });
  } else {
    sortOption = { createdAt: -1 }; // Default sort by newest
  }

  // Field projection: ?select=name,price
  let projection = "";
  if (queryParams.select) {
    projection = queryParams.select.split(",").join(" ");
  }

  const games = await Game.find(filter)
    .select(projection)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const totalItems = await Game.countDocuments(filter);
  const paginationMeta = getPaginationMetadata(totalItems, page, limit);

  return { games, paginationMeta };
};

const getGameByAppId = async (appid) => {
  const game = await Game.findOne({ appid, isDeleted: { $ne: true } });
  if (!game) {
    throw new ApiError(404, `Game with App ID ${appid} not found.`);
  }
  return game;
};

const updateGame = async (appid, updateData) => {
  const game = await Game.findOneAndUpdate(
    { appid, isDeleted: { $ne: true } },
    updateData,
    { new: true, runValidators: true }
  );

  if (!game) {
    throw new ApiError(404, `Game with App ID ${appid} not found.`);
  }
  return game;
};

const softDeleteGame = async (appid) => {
  const game = await Game.findOneAndUpdate(
    { appid, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true }
  );

  if (!game) {
    throw new ApiError(404, `Game with App ID ${appid} not found.`);
  }
  return game;
};

module.exports = {
  createGame,
  getGames,
  getGameByAppId,
  updateGame,
  softDeleteGame
};
