const userService = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Controller for User Management (Admin specific / auditing)
 */

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(new ApiResponse(200, users, "Users list loaded successfully."));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, "User details fetched successfully."));
});

module.exports = {
  getAllUsers,
  getUserById
};
