const express = require("express");
const {
  register,
  login,
  getProfile,
  logout
} = require("../controllers/auth.controller");
const { authProtect } = require("../middlewares/auth.middleware");
const {
  validateUserRegistration,
  validateUserLogin
} = require("../middlewares/validate.middleware");

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/logout", logout);
router.get("/profile", authProtect, getProfile);

module.exports = router;
