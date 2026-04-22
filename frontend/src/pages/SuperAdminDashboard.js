import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const SuperAdminDashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FORM STATE
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    logo: "",
    theme_color: "",
    adminName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  // 🔥 FETCH TENANTS
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await API.get("/superadmin/tenants");
      setTenants(res.data.tenants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CREATE TENANT
  const handleCreate = async () => {
    try {
      await API.post("/superadmin/create-tenant", form);

      alert("Tenant Created ✅");

      // 🔄 reset form
      setForm({
        name: "",
        subdomain: "",
        logo: "",
        theme_color: "",
        adminName: "",
        email: "",
        password: "",
      });

      fetchTenants();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={page}>
      <Navbar />

      <div style={container}>
        <h2 style={title}>Super Admin Dashboard</h2>

        {/* 🔥 CREATE TENANT FORM */}
        <div style={card}>
          <h3 style={cardTitle}>Create Tenant</h3>

          <div style={formGrid}>
            <input
              value={form.name}
              placeholder="Company Name"
              style={input}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              value={form.subdomain}
              placeholder="Subdomain (ex: infosys)"
              style={input}
              onChange={(e) =>
                setForm({ ...form, subdomain: e.target.value })
              }
            />

            <input
              value={form.logo}
              placeholder="Logo Path (/uploads/logo.png)"
              style={input}
              onChange={(e) =>
                setForm({ ...form, logo: e.target.value })
              }
            />

            <input
              value={form.theme_color}
              placeholder="Theme Color (#ff6600)"
              style={input}
              onChange={(e) =>
                setForm({ ...form, theme_color: e.target.value })
              }
            />

            <input
              value={form.adminName}
              placeholder="Admin Name"
              style={input}
              onChange={(e) =>
                setForm({ ...form, adminName: e.target.value })
              }
            />

            <input
              value={form.email}
              placeholder="Admin Email"
              style={input}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              value={form.password}
              placeholder="Password"
              style={input}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button style={primaryBtn} onClick={handleCreate}>
            Create Tenant
          </button>
        </div>

        {/* 🔥 TABLE */}
        <div style={tableCard}>
          <h3 style={cardTitle}>Tenants Overview</h3>

          {loading ? (
            <p style={center}>Loading...</p>
          ) : tenants.length === 0 ? (
            <p style={center}>No tenants found 🚀</p>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Tenant</th>
                  <th style={th}>Subdomain</th>
                  <th style={th}>Admin</th>
                  <th style={th}>Email</th>
                </tr>
              </thead>

              <tbody>
                {tenants.map((t, index) => (
                  <tr
                    key={t.id}
                    style={{
                      ...row,
                      background:
                        index % 2 === 0 ? "#fff" : "#f9fbff",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "#eef3ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        index % 2 === 0 ? "#fff" : "#f9fbff")
                    }
                  >
                    <td style={td}>
                      <b>{t.name}</b>
                    </td>

                    <td style={td}>
                      <span style={badge}>
                        {t.subdomain}.localhost
                      </span>
                    </td>

                    <td style={td}>{t.admin_name || "-"}</td>
                    <td style={td}>{t.admin_email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;


// 🎨 STYLES
const page = {
  background: "#f4f6f9",
  minHeight: "100vh",
};

const container = {
  maxWidth: "1100px",
  margin: "auto",
  padding: "20px",
};

const title = {
  textAlign: "center",
  marginBottom: "20px",
  fontWeight: "600",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: "25px",
};

const tableCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const cardTitle = {
  marginBottom: "15px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const primaryBtn = {
  marginTop: "15px",
  width: "100%",
  padding: "12px",
  background: "#4a90e2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px",
  background: "#4a90e2",
  color: "#fff",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const row = {
  transition: "0.2s",
};

const badge = {
  background: "#eef3ff",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
};

const center = {
  textAlign: "center",
};