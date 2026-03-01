import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  const { token } = useAuth();
  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
          <Toaster position="top-right" />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
