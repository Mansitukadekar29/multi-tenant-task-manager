import React from "react";

const Navbar = () => {
  const tenant = JSON.parse(localStorage.getItem("tenant"));

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        background: tenant?.theme_color || "#4a90e2",
        color: "#fff",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        {tenant?.logo && (
          <img src={tenant.logo} width="35" alt="logo" />
        )}
        <h3>{tenant?.name || "Task Manager"}</h3>
      </div>

      <button onClick={logout} style={{ background: "red", color: "#fff" }}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;