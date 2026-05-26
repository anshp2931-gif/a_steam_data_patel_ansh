const express = require("express");
const { getAllUsers, getUserById } = require("../controllers/user.controller");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/rbac.middleware");

const router = express.Router();

// All user management routes require admin role
router.use(authProtect, authorizeRoles("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
