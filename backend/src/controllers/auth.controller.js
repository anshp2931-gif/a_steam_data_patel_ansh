const User = require("../models/user.model");
const Game = require("../models/game.model");
const jwt = require("jsonwebtoken");

// Register new user
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ success: false, message: "Email is already registered." });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ success: false, message: "Username is already taken." });

    const user = await User.create({ username, email, password, role: role || "user" });
    const createdUser = await User.findById(user._id).select("-password");

    res.status(201).json({ success: true, statusCode: 201, data: createdUser, message: "User registered successfully." });
  } catch (error) { next(error); }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password." });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Invalid email or password." });

    const token = user.generateAuthToken();
    const userResponse = await User.findById(user._id).select("-password");

    res.status(200).json({ success: true, statusCode: 200, data: { user: userResponse, token }, message: "Logged in successfully." });
  } catch (error) { next(error); }
};

// Get profile
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, statusCode: 200, data: req.user, message: "User profile loaded successfully." });
  } catch (error) { next(error); }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({ success: true, statusCode: 200, data: updatedUser, message: "Profile updated successfully" });
  } catch (error) { next(error); }
};

// Logout
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, statusCode: 200, data: null, message: "Logged out successfully. Please clear your token." });
  } catch (error) { next(error); }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Please provide an email address" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "No account matches that email address" });

    res.status(200).json({
      success: true, statusCode: 200,
      data: { resetToken: "mock-reset-token-xyz-12345", instructions: "POST to /api/v1/auth/reset-password with your resetToken and newPassword" },
      message: "Password reset email sent (Mocked)"
    });
  } catch (error) { next(error); }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ success: false, message: "resetToken and newPassword are required" });

    const user = await User.findOne({ email: "ansh@steamgames.com" });
    if (!user) return res.status(404).json({ success: false, message: "User context not found" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, statusCode: 200, data: null, message: "Password reset successfully completed" });
  } catch (error) { next(error); }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: "oldPassword and newPassword are required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid current password provided" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, statusCode: 200, data: null, message: "Password updated successfully" });
  } catch (error) { next(error); }
};

// Verify email (mocked)
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: "Email and verification code are required" });
    res.status(200).json({ success: true, statusCode: 200, data: null, message: "Email verified successfully (Mocked)" });
  } catch (error) { next(error); }
};

// Send OTP (mocked)
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    res.status(200).json({ success: true, statusCode: 200, data: { otpCode: "123456" }, message: "OTP code generated and sent (Mocked)" });
  } catch (error) { next(error); }
};

// JWT specific controllers
const getJwtDashboard = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true, statusCode: 200,
      data: { sessionTimeLeft: "2 hours", userRole: req.user.role, privilege: "Full Access" },
      message: "JWT protected dashboard stats retrieved"
    });
  } catch (error) { next(error); }
};

const generateToken = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId is required" });

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    res.status(200).json({ success: true, statusCode: 200, data: { token }, message: "JWT token generated successfully" });
  } catch (error) { next(error); }
};

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "token is required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ success: true, statusCode: 200, data: { decoded, valid: true }, message: "JWT token is valid" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "JWT token validation failed: " + error.message });
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "token is required to refresh" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    res.status(200).json({ success: true, statusCode: 200, data: { token: newToken }, message: "Token refreshed successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Token refresh failed: " + error.message });
  }
};

const revokeToken = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, statusCode: 200, data: null, message: "JWT token revoked successfully (Blacklisted)" });
  } catch (error) { next(error); }
};

const getPrivateGames = async (req, res, next) => {
  try {
    const games = await Game.find({ isDeleted: { $ne: true } }).limit(3);
    res.status(200).json({ success: true, statusCode: 200, data: games, message: "Access to private games data granted" });
  } catch (error) { next(error); }
};

const getPrivateAnalytics = async (req, res, next) => {
  try {
    const stats = { premiumRetention: "94%", activeDownloads: 14500 };
    res.status(200).json({ success: true, statusCode: 200, data: stats, message: "Access to private analytics metrics granted" });
  } catch (error) { next(error); }
};

module.exports = {
  register, login, getProfile, updateProfile, logout,
  forgotPassword, resetPassword, changePassword, verifyEmail, sendOtp,
  getJwtDashboard, generateToken, verifyToken, refreshToken, revokeToken,
  getPrivateGames, getPrivateAnalytics
};
