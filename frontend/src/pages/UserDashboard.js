import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import CreateTask from "../components/CreateTask";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Safe user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔥 Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      // 🔹 Dashboard stats
      const dash = await API.get("/dashboard/user");
      setStats(dash.data.stats || {
        total: 0,
        pending: 0,
        completed: 0,
      });

      // 🔹 Tasks
      const taskRes = await API.get("/tasks");
      setTasks(taskRes.data.tasks || []);

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔄 Loading
  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />

      {/* 🔹 Header */}
      <h2 style={header}>User Dashboard</h2>

      {/* 🔹 Stats */}
      <div style={statsGrid}>
        <div style={statCard}>
          <span>Total</span>
          <h3>{stats.total}</h3>
        </div>

        <div style={statCard}>
          <span>Pending</span>
          <h3>{stats.pending}</h3>
        </div>

        <div style={statCard}>
          <span>Completed</span>
          <h3>{stats.completed}</h3>
        </div>
      </div>

      {/* 🔹 Create Task */}
      <CreateTask refresh={fetchData} />

      {/* 🔹 Tasks */}
      <div style={{ margin: "20px" }}>
        <h3>My Tasks</h3>

        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>
            No tasks yet 🚀
          </p>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              currentUserId={user?.id}
              refresh={fetchData}
            />
          ))
        )}
      </div>
    </div>
  );
};


// 🎨 styles
const header = {
  textAlign: "center",
  marginTop: "20px",
  fontWeight: "600",
};

const statsGrid = {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  marginTop: "20px",
};

const statCard = {
  background: "#fff",
  padding: "15px 25px",
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  textAlign: "center",
  minWidth: "120px",
};

export default UserDashboard;