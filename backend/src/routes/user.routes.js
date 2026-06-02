const express = require("express");
const { getAllUsers, getUserById } = require("../controllers/user.controller");
const { authProtect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authProtect, authorizeRoles("admin"));
router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
