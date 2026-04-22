const pool = require("../config/db");


// 🔥 ADMIN DASHBOARD
exports.getAdminDashboard = async (req, res) => {
  try {
    const { tenantId } = req.user;

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant not found in token",
      });
    }

    // 🔹 Task stats
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
        COUNT(*) FILTER (
          WHERE due_date < NOW() AND status != 'completed'
        )::int AS overdue
       FROM tasks
       WHERE tenant_id = $1`,
      [tenantId]
    );

    // 🔹 User-wise tasks
    const usersResult = await pool.query(
      `SELECT 
        u.id,
        u.name,
        COUNT(t.id)::int AS total_tasks,
        COUNT(t.id) FILTER (WHERE t.status='completed')::int AS completed_tasks,
        COUNT(t.id) FILTER (WHERE t.status='pending')::int AS pending_tasks
       FROM users u
       LEFT JOIN tasks t 
         ON u.id = t.assigned_to AND t.tenant_id = $1
       WHERE u.tenant_id = $1
       GROUP BY u.id, u.name
       ORDER BY u.name`
      ,
      [tenantId]
    );

    res.status(200).json({
      message: "Admin dashboard data fetched",
      stats: statsResult.rows[0],
      users: usersResult.rows,
    });

  } catch (err) {
    console.error("Admin Dashboard Error:", err);

    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};


// 🔥 USER DASHBOARD
exports.getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({
        message: "User not found in token",
      });
    }

    const result = await pool.query(
      `SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status='pending')::int AS pending,
        COUNT(*) FILTER (WHERE status='completed')::int AS completed,
        COUNT(*) FILTER (
          WHERE due_date < NOW() AND status != 'completed'
        )::int AS overdue
       FROM tasks
       WHERE assigned_to = $1`,
      [userId]
    );

    res.status(200).json({
      message: "User dashboard data fetched",
      stats: result.rows[0], // 🔥 FRONTEND expects stats
    });

  } catch (err) {
    console.error("User Dashboard Error:", err);

    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};