import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import CreateTask from "../components/CreateTask";
import CreateUser from "../components/CreateUser";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);

  // 🔥 Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await API.get("/tasks");
      setTasks(res.data.tasks || []);

      const dash = await API.get("/dashboard/admin");
      setStats(
        dash.data.stats || {
          total: 0,
          pending: 0,
          completed: 0,
          overdue: 0,
        }
      );
    } catch (err) {
      console.error("Admin Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={page}>
      <Navbar />

      <div style={container}>
        <h2 style={title}>📊 Admin Dashboard</h2>

        {/* 🔥 STATS */}
        <div style={statsGrid}>
          <div style={statCard}>
            <h4>Total</h4>
            <h2>{stats.total}</h2>
          </div>

          <div style={statCard}>
            <h4>Pending</h4>
            <h2>{stats.pending}</h2>
          </div>

          <div style={statCard}>
            <h4>Completed</h4>
            <h2>{stats.completed}</h2>
          </div>

          <div style={statCard}>
            <h4>Overdue</h4>
            <h2>{stats.overdue}</h2>
          </div>
        </div>

        {/* 🔥 CREATE USER BUTTON */}
        <div style={actionBar}>
          <button
            style={userBtn}
            onClick={() => setShowUserForm(!showUserForm)}
          >
            {showUserForm ? "Close User ❌" : "+ Create User 👤"}
          </button>
        </div>

        {/* 🔥 CREATE USER */}
        {showUserForm && <CreateUser refresh={fetchData} />}

        {/* 🔥 CREATE TASK */}
        <div style={card}>
          <h3>Create Task</h3>
          <CreateTask refresh={fetchData} />
        </div>

        {/* 🔥 TASK LIST */}
        <div style={card}>
          <h3>All Tasks</h3>

          {tasks.length === 0 ? (
            <p style={empty}>No tasks yet 🚀</p>
          ) : (
            <div style={taskGrid}>
              {tasks.map((t) => (
                <TaskCard key={t.id} task={t} refresh={fetchData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

//
// 🎨 STYLES
//

const page = {
  background: "#f4f6f9",
  minHeight: "100vh",
};

const container = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "20px",
};

const title = {
  textAlign: "center",
  marginBottom: "25px",
  fontWeight: "700",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
  gap: "15px",
  marginBottom: "25px",
};

const statCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const actionBar = {
  textAlign: "center",
  marginBottom: "20px",
};

const userBtn = {
  padding: "12px 20px",
  background: "linear-gradient(135deg,#28a745,#218838)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  marginBottom: "20px",
};

const taskGrid = {
  display: "grid",
  gap: "10px",
};

const empty = {
  textAlign: "center",
  color: "#777",
};