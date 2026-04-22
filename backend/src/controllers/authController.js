const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let user;
    let tenant = null;

    // 🔥 SUPER ADMIN
    const superAdminRes = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role='super_admin'",
      [email]
    );

    if (superAdminRes.rows.length > 0) {
      user = superAdminRes.rows[0];
    } else {
      // 🔥 TENANT USER
      tenant = req.tenant;

      if (!tenant) {
        return res.status(400).json({ message: "Tenant required" });
      }

      const userRes = await pool.query(
        "SELECT * FROM users WHERE email=$1 AND tenant_id=$2",
        [email, tenant.id]
      );

      if (userRes.rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      user = userRes.rows[0];
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id || null,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    delete user.password;

    res.json({
      token,
      user,
      tenant, // 🔥 VERY IMPORTANT
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};