const userService = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Controller for User Authentication
 */

const register = asyncHandler(async (req, res) => {
  const user = await userService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully."));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: result.user,
        token: result.token
      },
      "Logged in successfully."
    )
  );
});

const getProfile = asyncHandler(async (req, res) => {
  // User is already attached by authProtect middleware
  res.status(200).json(new ApiResponse(200, req.user, "User profile loaded successfully."));
});

const logout = asyncHandler(async (req, res) => {
  // Stateless JWT logs out by removing it on the client-side. We return a friendly message.
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully. Please clear your token."));
});

module.exports = {
  register,
  login,
  getProfile,
  logout
};
