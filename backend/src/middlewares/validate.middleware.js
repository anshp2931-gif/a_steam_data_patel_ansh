const ApiError = require("../utils/ApiError");

/**
 * Custom Input Validation Middleware
 */
const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.trim().length < 3) {
    return next(new ApiError(400, "Username must be at least 3 characters long."));
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return next(new ApiError(400, "Please provide a valid email address."));
  }

  if (!password || password.length < 6) {
    return next(new ApiError(400, "Password must be at least 6 characters long."));
  }

  next();
};

const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new ApiError(400, "Email is required to log in."));
  }

  if (!password) {
    return next(new ApiError(400, "Password is required to log in."));
  }

  next();
};

const validateGameInput = (req, res, next) => {
  const { appid, name, price, developer, publisher } = req.body;

  // Only run if creating a game or updating vital fields
  if (req.method === "POST") {
    if (!appid || appid.trim() === "") {
      return next(new ApiError(400, "Game appid is required."));
    }
    if (!name || name.trim() === "") {
      return next(new ApiError(400, "Game name is required."));
    }
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return next(new ApiError(400, "A valid non-negative price is required."));
    }
    if (!developer || developer.trim() === "") {
      return next(new ApiError(400, "Developer name is required."));
    }
    if (!publisher || publisher.trim() === "") {
      return next(new ApiError(400, "Publisher name is required."));
    }
  } else if (req.method === "PUT" || req.method === "PATCH") {
    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      return next(new ApiError(400, "Price must be a non-negative number."));
    }
  }

  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateGameInput
};
