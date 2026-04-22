const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================

// 🔐 Auth Routes
app.use("/api/auth", require("./src/routes/authRoutes"));

// 👑 Super Admin Routes
app.use("/api/superadmin", require("./src/routes/superAdminRoutes"));

// 🧑‍💼 Admin Routes
app.use("/api/admin", require("./src/routes/adminRoutes"));

// 🏢 Tenant Routes (branding)
app.use("/api/tenant", require("./src/routes/tenantRoutes"));

// 📋 Task Routes
app.use("/api/tasks", require("./src/routes/taskRoutes"));

// 📊 Dashboard Routes (NEW)
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("🚀 Multi-Tenant API Running");
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});