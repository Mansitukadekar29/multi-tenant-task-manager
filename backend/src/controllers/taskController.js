const pool = require("../config/db");


// =======================================================
// 🔥 1. CREATE TASK (Admin + User)
// =======================================================
exports.createTask = async (req, res) => {
  try {
    let { title, description, assigned_to, due_date } = req.body;

    const { userId, tenantId, role } = req.user;

    // 🔒 Validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description required",
      });
    }

    // 🔥 Convert assigned_to → number safely
    assigned_to = assigned_to ? Number(assigned_to) : null;

    let assignedUser = assigned_to;

    // 👤 USER → only self assign
    if (role === "user") {
      assignedUser = userId;
    }

    // 👑 ADMIN → validate assigned user
    if (role === "admin" && assignedUser) {
      const userCheck = await pool.query(
        "SELECT id, name FROM users WHERE id=$1 AND tenant_id=$2",
        [assignedUser, tenantId]
      );

      if (userCheck.rows.length === 0) {
        return res.status(400).json({
          message: "Invalid user for this tenant",
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO tasks 
       (tenant_id, created_by, assigned_to, title, description, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        tenantId,
        userId,
        assignedUser || userId,
        title,
        description,
        due_date || null,
      ]
    );

    res.status(201).json({
      message: "Task created successfully",
      task: result.rows[0],
    });

  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};



// =======================================================
// 🔥 2. GET TASKS (Admin = all, User = own)
// 👉 WITH ASSIGNED USER NAME
// =======================================================
exports.getTasks = async (req, res) => {
  try {
    const { role, userId, tenantId } = req.user;

    let result;

    if (role === "admin") {
      result = await pool.query(
        `SELECT 
           t.*,
           u.name AS assigned_user
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         WHERE t.tenant_id = $1
         ORDER BY t.created_at DESC`,
        [tenantId]
      );
    } else {
      result = await pool.query(
        `SELECT 
           t.*,
           u.name AS assigned_user
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         WHERE t.assigned_to = $1
         ORDER BY t.created_at DESC`,
        [userId]
      );
    }

    res.status(200).json({
      message: "Tasks fetched",
      tasks: result.rows,   // 🔥 FIX (frontend expects tasks)
    });

  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};



// =======================================================
// 🔥 3. UPDATE TASK
// 👉 ONLY ASSIGNED USER CAN UPDATE
// =======================================================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const { userId, tenantId } = req.user;

    const task = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND tenant_id = $2",
      [id, tenantId]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const taskData = task.rows[0];

    // 🔐 Only assigned user can update
    if (taskData.assigned_to !== userId) {
      return res.status(403).json({
        message: "Only assigned user can update task",
      });
    }

    // 🔥 Handle completed time
    let completed_at = taskData.completed_at;

    if (status === "completed") {
      completed_at = new Date();
    } else if (status === "pending") {
      completed_at = null;
    }

    const updated = await pool.query(
      `UPDATE tasks
       SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         completed_at = $4
       WHERE id = $5
       RETURNING *`,
      [title, description, status, completed_at, id]
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: updated.rows[0],
    });

  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};