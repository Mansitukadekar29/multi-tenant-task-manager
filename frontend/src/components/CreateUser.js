import React, { useState } from "react";
import API from "../services/api";

const CreateUser = ({ refresh }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("All fields required");
    }

    try {
      await API.post("/admin/create-user", form);

      alert("User Created ✅");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      refresh(); // 🔥 refresh users list

    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div style={card}>
      <h3>Create User</h3>

      <form style={grid} onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button style={btn}>Create User</button>
      </form>
    </div>
  );
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  margin: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const btn = {
  gridColumn: "span 2",
  padding: "10px",
  background: "#28a745",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default CreateUser;