const express = require("express");
const Game = require("../models/game.model");
const { authProtect, authorizeRoles } = require("../middleware/auth.middleware");
const { validateGameInput } = require("../middleware/validate.middleware");
const NF = { isDeleted: { $ne: true } };

const router = express.Router();

router.use(authProtect);

router.get("/admin/games", authorizeRoles("admin"), async (req, res, next) => {
  try {
    const games = await Game.find(NF);
    res.status(200).json({ success: true, statusCode: 200, data: games, message: "Admin protected games loaded" });
  } catch (error) { next(error); }
});

router.get("/admin/analytics", authorizeRoles("admin"), async (req, res, next) => {
  try {
    res.status(200).json({ success: true, statusCode: 200, data: { totalRevenue: 542000, activeSubscribers: 4300, serverCPUUsage: "12%", apiCallsToday: 450000 }, message: "Admin analytics dashboard loaded" });
  } catch (error) { next(error); }
});

router.get("/admin/reports", authorizeRoles("admin"), async (req, res, next) => {
  try {
    res.status(200).json({ success: true, statusCode: 200, data: [{ reportId: "R-101", title: "Daily Sales Report", status: "Generated" }, { reportId: "R-102", title: "Weekly Active User Retention", status: "Processing" }], message: "Admin reports list loaded" });
  } catch (error) { next(error); }
});

router.post("/protected/games", authorizeRoles("admin"), validateGameInput, async (req, res, next) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json({ success: true, statusCode: 201, data: game, message: "Game added successfully via protected route" });
  } catch (error) { next(error); }
});

router.patch("/protected/games/:appid", authorizeRoles("admin"), async (req, res, next) => {
  try {
    const game = await Game.findOneAndUpdate({ appid: req.params.appid, ...NF }, { $set: req.body }, { new: true, runValidators: true });
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });
    res.status(200).json({ success: true, statusCode: 200, data: game, message: "Game updated via protected route" });
  } catch (error) { next(error); }
});

router.delete("/protected/games/:appid", authorizeRoles("admin"), async (req, res, next) => {
  try {
    const game = await Game.findOneAndDelete({ appid: req.params.appid });
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });
    res.status(200).json({ success: true, statusCode: 200, data: null, message: "Game permanently deleted via protected route" });
  } catch (error) { next(error); }
});

module.exports = router;
