const express = require("express");
const router = express.Router();

const {
  createTenant,
  getAllTenants,
  getSuperAdminDashboard
} = require("../controllers/superAdminController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/create-tenant", auth, role("super_admin"), createTenant);

router.get("/tenants", auth, role("super_admin"), getAllTenants);

router.get("/dashboard", auth, role("super_admin"), getSuperAdminDashboard);

module.exports = router;