const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");
const envConfig = require("../config/env.config");

const authProtect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header (Format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Not authorized to access this route. Token missing.");
    }

    // Verify token
    const decoded = jwt.verify(token, envConfig.jwtSecret);

    // Fetch user and attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isDeleted) {
      throw new ApiError(401, "User belonging to this token no longer exists.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authProtect };
