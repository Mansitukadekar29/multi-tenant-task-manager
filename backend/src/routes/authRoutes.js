const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const tenantMiddleware = require("../middleware/tenantMiddleware");

// super admin login
router.post("/login", login);

// tenant login (admin + user)
router.post("/tenant-login", tenantMiddleware, login);

module.exports = router;