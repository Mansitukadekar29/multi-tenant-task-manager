const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const host = req.headers.host;

    if (!host) {
      return res.status(400).json({ message: "Host header missing" });
    }

    // Example: x.localhost:3000 → x
    const subdomain = host.split(".")[0];

    // 🔥 Ignore cases like localhost (no tenant)
    if (subdomain === "localhost" || subdomain === "127") {
      return res.status(400).json({ message: "Invalid tenant subdomain" });
    }

    // 🔍 Find tenant
    const result = await pool.query(
      "SELECT * FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // ✅ Attach tenant to request
    req.tenant = result.rows[0];

    next();

  } catch (err) {
    console.error("Tenant Middleware Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};