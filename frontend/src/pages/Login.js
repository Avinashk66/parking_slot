import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🅿️</div>
        <h1 style={styles.title}>ParkSmart</h1>
        <p style={styles.subtitle}>Smart Parking Management</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
    textAlign: "center",
  },
  logo: { fontSize: "48px", marginBottom: "8px" },
  title: { margin: "0 0 4px", fontSize: "28px", color: "#1a1a2e", fontWeight: "800" },
  subtitle: { color: "#888", marginBottom: "32px", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#555" },
  input: {
    padding: "12px 16px",
    border: "2px solid #e8ecf0",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    background: "linear-gradient(135deg, #e94560, #c23152)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    transition: "opacity 0.2s",
  },
  footer: { marginTop: "24px", color: "#888", fontSize: "14px" },
  link: { color: "#e94560", fontWeight: "600", textDecoration: "none" },
};
