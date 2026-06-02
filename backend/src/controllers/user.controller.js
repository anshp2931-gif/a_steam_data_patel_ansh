const User = require("../models/user.model");

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } }).select("-password");
    res.status(200).json({ success: true, statusCode: 200, data: users, message: "Users list loaded successfully." });
  } catch (error) { next(error); }
};

// Get user by ID (admin only)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, statusCode: 200, data: user, message: "User details fetched successfully." });
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, getUserById };
