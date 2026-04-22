const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// 🔥 1. Create User (Admin only)
router.post("/create-user", auth, role("admin"), createUser);

// 🔥 2. Get All Users (FOR DROPDOWN)
router.get("/users", auth, role("admin"), getUsers);

// 🔥 3. Delete User (optional)
router.delete("/user/:id", auth, role("admin"), deleteUser);

module.exports = router;