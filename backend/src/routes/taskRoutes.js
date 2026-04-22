const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
} = require("../controllers/taskController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask);

module.exports = router;