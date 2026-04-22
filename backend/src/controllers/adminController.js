const pool = require("../config/db");
const bcrypt = require("bcrypt");

// 🔥 Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const tenantId = req.user.tenantId;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (tenant_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, 'user')`,
      [tenantId, name, email, hash]
    );

    res.json({ message: "User created" });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({ message: err.message });
  }
};


// 🔥 Get Users (FOR DROPDOWN)
exports.getUsers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const users = await pool.query(
      "SELECT id, name FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    res.json(users.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 Delete User (optional)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};