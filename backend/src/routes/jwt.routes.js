const express = require("express");
const {
  getProfile, getJwtDashboard, generateToken, verifyToken,
  refreshToken, revokeToken, getPrivateGames, getPrivateAnalytics
} = require("../controllers/auth.controller");
const { authProtect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/generate-token", generateToken);
router.post("/verify-token", verifyToken);
router.post("/refresh-token", refreshToken);
router.delete("/revoke-token", revokeToken);

router.get("/profile", authProtect, getProfile);
router.get("/dashboard", authProtect, getJwtDashboard);
router.get("/private-games", authProtect, getPrivateGames);
router.get("/private-analytics", authProtect, getPrivateAnalytics);

module.exports = router;
