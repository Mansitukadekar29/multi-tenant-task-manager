import React, { useEffect, useState } from "react";
import API from "../services/api";

const CreateTask = ({ refresh }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Load users
  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  // 🔥 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      return alert("Title & Description required");
    }

    try {
      setLoading(true);

      await API.post("/tasks", {
        title: form.title,
        description: form.description,
        assigned_to: form.assigned_to
          ? Number(form.assigned_to)
          : undefined,
        due_date: form.due_date || null,
      });

      // ✅ SUCCESS (single alert only)
      alert("Task Created ✅");

      // 🔄 Reset form
      setForm({
        title: "",
        description: "",
        assigned_to: "",
        due_date: "",
      });

      // 🔄 Refresh dashboard
      if (refresh) refresh();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h3>Create Task</h3>

      <form style={formGrid} onSubmit={handleSubmit}>
        {/* 🔹 Title */}
        <input
          value={form.title}
          placeholder="Enter task title"
          style={input}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* 🔹 Description */}
        <input
          value={form.description}
          placeholder="Enter description"
          style={input}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* 🔹 Assign User */}
        <select
          value={form.assigned_to}
          style={input}
          onChange={(e) =>
            setForm({ ...form, assigned_to: e.target.value })
          }
        >
          <option value="">Assign User</option>

          {users.length === 0 ? (
            <option disabled>No users found</option>
          ) : (
            users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))
          )}
        </select>

        {/* 🔹 Due Date */}
        <input
          type="date"
          value={form.due_date}
          style={input}
          onChange={(e) =>
            setForm({ ...form, due_date: e.target.value })
          }
        />

        {/* 🔹 Button */}
        <button
          style={{
            ...btn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

// 🎨 Styles
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  margin: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = {
  gridColumn: "span 2",
  padding: "12px",
  background: "#4a90e2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

export default CreateTask;