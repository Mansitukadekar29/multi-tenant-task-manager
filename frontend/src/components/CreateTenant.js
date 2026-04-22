import React, { useState } from "react";
import API from "../services/api";

const CreateTenant = ({ refresh }) => {
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    logo: "",
    theme_color: "",
    adminName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.subdomain ||
      !form.adminName ||
      !form.email ||
      !form.password
    ) {
      return alert("All required fields fill करा");
    }

    try {
      await API.post("/superadmin/create-tenant", form);

      alert("Tenant Created ✅");

      setForm({
        name: "",
        subdomain: "",
        logo: "",
        theme_color: "",
        adminName: "",
        email: "",
        password: "",
      });

      refresh(); // 🔥 dashboard refresh

    } catch (err) {
      alert(err.response?.data?.message || "Error creating tenant");
    }
  };

  return (
    <div style={card}>
      <h3>Create Tenant</h3>

      <form style={grid} onSubmit={handleSubmit}>
        
        <input
          placeholder="Company Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Subdomain (ex: infosys)"
          value={form.subdomain}
          onChange={(e) =>
            setForm({ ...form, subdomain: e.target.value })
          }
        />

        <input
          placeholder="Logo Path (/uploads/logo.png)"
          value={form.logo}
          onChange={(e) =>
            setForm({ ...form, logo: e.target.value })
          }
        />

        <input
          placeholder="Theme Color (#ff6600)"
          value={form.theme_color}
          onChange={(e) =>
            setForm({ ...form, theme_color: e.target.value })
          }
        />

        <input
          placeholder="Admin Name"
          value={form.adminName}
          onChange={(e) =>
            setForm({ ...form, adminName: e.target.value })
          }
        />

        <input
          placeholder="Admin Email"
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

        <button style={btn}>Create Tenant</button>
      </form>
    </div>
  );
};

// 🎨 styles
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
  background: "#4a90e2",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default CreateTenant;