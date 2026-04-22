import React, { useState, useEffect } from "react";
import API from "../services/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [tenant, setTenant] = useState(null);
  const [tenantError, setTenantError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;

    // 🔥 Subdomain detect
    if (host.includes(".") && !host.startsWith("localhost")) {
      API.get("/tenant/info")
        .then((res) => {
          setTenant(res.data);
          setTenantError(false);
        })
        .catch(() => {
          setTenant(null);
          setTenantError(true);
        })
        .finally(() => setLoading(false));
    } else {
      // localhost → super admin
      setTenant(null);
      setTenantError(false);
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Email & Password required");
    }

    try {
      setLoginLoading(true);

      const url = tenant ? "/auth/tenant-login" : "/auth/login";

      const res = await API.post(url, form);

      // 🔥 SAVE TOKEN + USER
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 MOST IMPORTANT (ADD THIS)
      if (res.data.tenant) {
        localStorage.setItem("tenant", JSON.stringify(res.data.tenant));
      } else {
        localStorage.removeItem("tenant"); // super admin case
      }

      const role = res.data.user.role;

      if (role === "super_admin") window.location.href = "/superadmin";
      else if (role === "admin") window.location.href = "/admin";
      else window.location.href = "/user";

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // 🔄 Loading screen
  if (loading) {
    return (
      <div style={loadingBox}>
        <h3>Loading...</h3>
      </div>
    );
  }

  // ❌ Tenant not found
  if (tenantError) {
    return (
      <div style={errorBox}>
        <h2>❌ Tenant Not Available</h2>
      </div>
    );
  }

  return (
    <div style={container(tenant)}>
      <div style={card}>
        {/* 🔹 Logo */}
        {tenant?.logo && (
          <img src={tenant.logo} width="80" alt="logo" />
        )}

        {/* 🔹 Title */}
        <h2>{tenant ? tenant.name : "Super Admin Login"}</h2>

        <form onSubmit={handleSubmit}>
          {/* 🔹 Email */}
          <input
            placeholder="Enter Email"
            style={input}
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* 🔹 Password */}
          <input
            type="password"
            placeholder="Enter Password"
            style={input}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* 🔹 Button */}
          <button
            style={{
              ...btn(tenant),
              opacity: loginLoading ? 0.6 : 1,
              cursor: loginLoading ? "not-allowed" : "pointer",
            }}
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};


// 🎨 Styles
const container = (tenant) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: tenant?.theme_color || "#4a90e2",
});

const card = {
  background: "#fff",
  padding: "40px",
  borderRadius: "12px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = (tenant) => ({
  width: "100%",
  padding: "10px",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  background: tenant?.theme_color || "#333",
});

const errorBox = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "red",
  fontWeight: "bold",
};

const loadingBox = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default Login;