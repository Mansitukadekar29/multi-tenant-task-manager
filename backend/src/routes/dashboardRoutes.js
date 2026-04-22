const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getUserDashboard,
} = require("../controllers/dashboardController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Admin dashboard
router.get("/admin", auth, role("admin"), getAdminDashboard);

// User dashboard
router.get("/user", auth, role("user"), getUserDashboard);

module.exports = router;