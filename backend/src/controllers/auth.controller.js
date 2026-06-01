const userService = require("../services/user.service");
const User = require("../models/user.model");
const Game = require("../models/game.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const config = require("../config/env.config");

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

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;

  res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const logout = asyncHandler(async (req, res) => {
  // Stateless JWT logs out by removing it on the client-side. We return a friendly message.
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully. Please clear your token."));
});

// Password recovery controllers
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Please provide an email address");
  
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "No account matches that email address");

  // In real life, send a mail. Here we return a mock link.
  res.status(200).json(new ApiResponse(200, {
    resetToken: "mock-reset-token-xyz-12345",
    instructions: "POST to /api/v1/auth/reset-password with your resetToken and newPassword"
  }, "Password reset email sent (Mocked)"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    throw new ApiError(400, "resetToken and newPassword are required");
  }

  // Find some user (for demonstration/seeding context)
  const user = await User.findOne({ email: "ansh@steamgames.com" });
  if (!user) throw new ApiError(404, "User context not found");

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password reset successfully completed"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "oldPassword and newPassword are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new ApiError(401, "Invalid current password provided");

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
});

// Verification and OTPs
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) throw new ApiError(400, "Email and verification code are required");
  res.status(200).json(new ApiResponse(200, null, "Email verified successfully (Mocked)"));
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");
  res.status(200).json(new ApiResponse(200, { otpCode: "123456" }, "OTP code generated and sent (Mocked)"));
});

// JWT specific routing controllers
const getJwtProfile = getProfile;

const getJwtDashboard = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {
    sessionTimeLeft: "2 hours",
    userRole: req.user.role,
    privilege: "Full Access"
  }, "JWT protected dashboard stats retrieved"));
});

const generateToken = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new ApiError(400, "userId is required");
  
  const token = jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  res.status(200).json(new ApiResponse(200, { token }, "JWT token generated successfully"));
});

const verifyToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, "token is required");

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    res.status(200).json(new ApiResponse(200, { decoded, valid: true }, "JWT token is valid"));
  } catch (err) {
    throw new ApiError(401, "JWT token validation failed: " + err.message);
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, "token is required to refresh");

  try {
    const decoded = jwt.verify(token, config.jwtSecret, { ignoreExpiration: true });
    const newToken = jwt.sign({ id: decoded.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    res.status(200).json(new ApiResponse(200, { token: newToken }, "Token refreshed successfully"));
  } catch (err) {
    throw new ApiError(400, "Token refresh failed: " + err.message);
  }
});

const revokeToken = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "JWT token revoked successfully (Blacklisted)"));
});

const getPrivateGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ isDeleted: { $ne: true } }).limit(3);
  res.status(200).json(new ApiResponse(200, games, "Access to private games data granted"));
});

const getPrivateAnalytics = asyncHandler(async (req, res) => {
  const stats = {
    premiumRetention: "94%",
    activeDownloads: 14500
  };
  res.status(200).json(new ApiResponse(200, stats, "Access to private analytics metrics granted"));
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  sendOtp,
  getJwtProfile,
  getJwtDashboard,
  generateToken,
  verifyToken,
  refreshToken,
  revokeToken,
  getPrivateGames,
  getPrivateAnalytics
};
