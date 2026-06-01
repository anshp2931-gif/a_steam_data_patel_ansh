const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  sendOtp
} = require("../controllers/auth.controller");
const { authProtect } = require("../middlewares/auth.middleware");
const {
  validateUserRegistration,
  validateUserLogin
} = require("../middlewares/validate.middleware");

const router = express.Router();

// Basic Authentication
router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/logout", logout);

// Profile Management
router.get("/profile", authProtect, getProfile);
router.patch("/profile", authProtect, updateProfile);

// Password Recoveries
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authProtect, changePassword);

// Email & OTP Verification
router.post("/verify-email", verifyEmail);
router.post("/send-otp", sendOtp);

module.exports = router;
