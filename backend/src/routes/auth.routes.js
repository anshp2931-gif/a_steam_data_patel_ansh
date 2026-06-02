const express = require("express");
const {
  register, login, logout, getProfile, updateProfile,
  forgotPassword, resetPassword, changePassword, verifyEmail, sendOtp
} = require("../controllers/auth.controller");
const { authProtect } = require("../middleware/auth.middleware");
const { validateUserRegistration, validateUserLogin } = require("../middleware/validate.middleware");

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/logout", logout);

router.get("/profile", authProtect, getProfile);
router.patch("/profile", authProtect, updateProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authProtect, changePassword);

router.post("/verify-email", verifyEmail);
router.post("/send-otp", sendOtp);

module.exports = router;
