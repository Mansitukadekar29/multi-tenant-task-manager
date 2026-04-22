const pool = require("../config/db");
const bcrypt = require("bcrypt");


// =======================================
// 🔥 CREATE TENANT + ADMIN
// =======================================
exports.createTenant = async (req, res) => {
  try {
    let {
      name,
      subdomain,
      logo,
      theme_color,
      adminName,
      email,
      password,
    } = req.body;

    if (!name || !subdomain || !adminName || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    subdomain = subdomain.toLowerCase().trim();
    email = email.toLowerCase().trim();

    const existingTenant = await pool.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (existingTenant.rows.length > 0) {
      return res.status(400).json({
        message: "Subdomain already exists",
      });
    }

    const tenantRes = await pool.query(
      `INSERT INTO tenants (name, subdomain, logo, theme_color)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, subdomain, logo || null, theme_color || "#4a90e2"]
    );

    const tenant = tenantRes.rows[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (tenant_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, 'admin')`,
      [tenant.id, adminName, email, hashedPassword]
    );

    res.status(201).json({
      message: "Tenant created successfully",
      tenant,
    });

  } catch (err) {
    console.error("Create Tenant Error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};


// =======================================
// 🔥 GET ALL TENANTS (FIXED)
// =======================================
exports.getAllTenants = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.name,
        t.subdomain,
        t.logo,
        t.theme_color,

        u.name AS admin_name,
        u.email AS admin_email

      FROM tenants t
      LEFT JOIN users u 
        ON t.id = u.tenant_id AND u.role = 'admin'

      ORDER BY t.id DESC
    `);

    res.json({
      tenants: result.rows,
    });

  } catch (err) {
    console.error("Get Tenants Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// =======================================
// 🔥 DASHBOARD STATS
// =======================================
exports.getSuperAdminDashboard = async (req, res) => {
  try {
    const tenants = await pool.query("SELECT COUNT(*)::int FROM tenants");
    const users = await pool.query("SELECT COUNT(*)::int FROM users");
    const tasks = await pool.query("SELECT COUNT(*)::int FROM tasks");

    res.json({
      stats: {
        tenants: tenants.rows[0].count,
        users: users.rows[0].count,
        tasks: tasks.rows[0].count,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};