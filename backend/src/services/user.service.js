const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

/**
 * User Business Logic Service
 */
const registerUser = async (userData) => {
  const { username, email, password, role } = userData;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email is already registered.");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(400, "Username is already taken.");
  }

  const user = await User.create({
    username,
    email,
    password,
    role: role || "user"
  });

  // Exclude password from return
  const createdUser = await User.findById(user._id).select("-password");
  return createdUser;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email, isDeleted: { $ne: true } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = user.generateAuthToken();

  const userResponse = await User.findById(user._id).select("-password");

  return { user: userResponse, token };
};

const getAllUsers = async () => {
  return await User.find({ isDeleted: { $ne: true } }).select("-password");
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user || user.isDeleted) {
    throw new ApiError(404, "User not found.");
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById
};
