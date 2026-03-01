import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navStyle = {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#e94560" : "#a8b2c1",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: location.pathname === path ? "600" : "400",
    transition: "all 0.2s",
    background: location.pathname === path ? "rgba(233,69,96,0.1)" : "transparent",
    fontSize: "14px",
  });

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "24px" }}>🅿️</span>
        <span style={{ color: "white", fontWeight: "700", fontSize: "18px", letterSpacing: "0.5px" }}>
          ParkSmart
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
        <Link to="/my-bookings" style={linkStyle("/my-bookings")}>My Bookings</Link>
        {isAdmin && <Link to="/admin" style={linkStyle("/admin")}>Admin Panel</Link>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{user?.name}</div>
          <div style={{ color: "#e94560", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
            {user?.role}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(233,69,96,0.15)",
            color: "#e94560",
            border: "1px solid rgba(233,69,96,0.3)",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
            transition: "all 0.2s",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
