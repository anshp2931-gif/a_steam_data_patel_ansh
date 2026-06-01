const express = require("express");
const {
  getJwtProfile,
  getJwtDashboard,
  generateToken,
  verifyToken,
  refreshToken,
  revokeToken,
  getPrivateGames,
  getPrivateAnalytics
} = require("../controllers/auth.controller");
const { authProtect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/generate-token", generateToken);
router.post("/verify-token", verifyToken);
router.post("/refresh-token", refreshToken);
router.delete("/revoke-token", revokeToken);

// Protected routes using JWT signature
router.get("/profile", authProtect, getJwtProfile);
router.get("/dashboard", authProtect, getJwtDashboard);
router.get("/private-games", authProtect, getPrivateGames);
router.get("/private-analytics", authProtect, getPrivateAnalytics);

module.exports = router;
