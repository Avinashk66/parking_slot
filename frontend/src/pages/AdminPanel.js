import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function AdminPanel() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("slots");
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ slotNumber: "", vehicleType: "Car", floor: "G" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        api.get("/slots"),
        api.get("/book/all"),
      ]);
      setSlots(slotsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post("/slots", newSlot);
      toast.success(`Slot ${newSlot.slotNumber} added!`);
      setShowAddSlot(false);
      setNewSlot({ slotNumber: "", vehicleType: "Car", floor: "G" });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add slot");
    }
  };

  const toggleStatus = async (slot) => {
    const newStatus = slot.status === "available" ? "occupied" : "available";
    try {
      await api.put(`/slots/${slot._id}`, { status: newStatus });
      toast.success(`Slot ${slot.slotNumber} marked as ${newStatus}`);
      fetchAll();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteSlot = async (id, slotNumber) => {
    if (!window.confirm(`Delete slot ${slotNumber}?`)) return;
    try {
      await api.delete(`/slots/${id}`);
      toast.success("Slot deleted");
      fetchAll();
    } catch (err) {
      toast.error("Failed to delete slot");
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/book/${id}`);
      toast.success("Booking cancelled");
      fetchAll();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const stats = {
    totalSlots: slots.length,
    available: slots.filter((s) => s.status === "available").length,
    activeBookings: bookings.filter((b) => b.status === "active").length,
    totalBookings: bookings.length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.subtitle}>Manage parking slots and bookings</p>
        </div>
        {tab === "slots" && (
          <button onClick={() => setShowAddSlot(true)} style={styles.addBtn}>
            + Add Slot
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        {[
          { label: "Total Slots", val: stats.totalSlots, color: "#2196f3" },
          { label: "Available", val: stats.available, color: "#4caf50" },
          { label: "Active Bookings", val: stats.activeBookings, color: "#ff9800" },
          { label: "All Bookings", val: stats.totalBookings, color: "#9c27b0" },
        ].map((s) => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.val}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["slots", "bookings"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...styles.tabBtn,
              background: tab === t ? "#1a1a2e" : "white",
              color: tab === t ? "white" : "#555",
            }}
          >
            {t === "slots" ? "🅿️ Parking Slots" : "📋 All Bookings"}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : tab === "slots" ? (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Slot #", "Type", "Floor", "Status", "Actions"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.slotNum}>{slot.slotNumber}</span>
                  </td>
                  <td style={styles.td}>{slot.vehicleType === "Car" ? "🚗 Car" : "🏍️ Bike"}</td>
                  <td style={styles.td}>Floor {slot.floor}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background: slot.status === "available" ? "#e8f5e9" : "#fce4ec",
                        color: slot.status === "available" ? "#388e3c" : "#c62828",
                      }}
                    >
                      {slot.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => toggleStatus(slot)} style={styles.actionBtn}>
                      Toggle Status
                    </button>
                    <button
                      onClick={() => deleteSlot(slot._id, slot.slotNumber)}
                      style={{ ...styles.actionBtn, color: "#e94560", borderColor: "#e94560" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {slots.length === 0 && (
            <div style={styles.emptyTable}>No slots added yet. Click "+ Add Slot" to get started.</div>
          )}
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["User", "Slot", "Vehicle No.", "Check-in", "Check-out", "Status", "Action"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "600" }}>{b.user?.name}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>{b.user?.email}</div>
                  </td>
                  <td style={styles.td}>{b.slot?.slotNumber}</td>
                  <td style={styles.td}>
                    <span style={styles.vehicleChip}>{b.vehicleNumber}</span>
                  </td>
                  <td style={styles.td}>
                    {new Date(b.bookingTime).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td style={styles.td}>
                    {new Date(b.endTime).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          b.status === "active" ? "#e8f5e9" : b.status === "cancelled" ? "#fce4ec" : "#e3f2fd",
                        color:
                          b.status === "active" ? "#388e3c" : b.status === "cancelled" ? "#c62828" : "#1565c0",
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {b.status === "active" && (
                      <button
                        onClick={() => cancelBooking(b._id)}
                        style={{ ...styles.actionBtn, color: "#e94560", borderColor: "#e94560" }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <div style={styles.emptyTable}>No bookings yet.</div>}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddSlot && (
        <div style={styles.overlay} onClick={() => setShowAddSlot(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Add New Parking Slot</h2>
            <form onSubmit={handleAddSlot} style={styles.modalForm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Slot Number</label>
                <input
                  type="text"
                  placeholder="e.g. A-01"
                  value={newSlot.slotNumber}
                  onChange={(e) => setNewSlot({ ...newSlot, slotNumber: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Vehicle Type</label>
                <select
                  value={newSlot.vehicleType}
                  onChange={(e) => setNewSlot({ ...newSlot, vehicleType: e.target.value })}
                  style={styles.input}
                >
                  <option value="Car">🚗 Car</option>
                  <option value="Bike">🏍️ Bike</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Floor</label>
                <select
                  value={newSlot.floor}
                  onChange={(e) => setNewSlot({ ...newSlot, floor: e.target.value })}
                  style={styles.input}
                >
                  {["G", "1", "2", "3", "B1", "B2"].map((f) => (
                    <option key={f} value={f}>{f === "G" ? "Ground" : f.startsWith("B") ? `Basement ${f.slice(1)}` : `Floor ${f}`}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowAddSlot(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>Add Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { margin: "0 0 4px", fontSize: "24px", fontWeight: "800", color: "#1a1a2e" },
  subtitle: { color: "#888", margin: 0, fontSize: "14px" },
  addBtn: {
    background: "linear-gradient(135deg, #e94560, #c23152)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  statNum: { fontSize: "32px", fontWeight: "800", marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#888", fontWeight: "500" },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px" },
  tabBtn: {
    padding: "10px 20px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  tableWrap: {
    background: "white",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#f8f9fa",
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #eee",
  },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "14px 16px", fontSize: "14px", color: "#333", verticalAlign: "middle" },
  slotNum: { fontWeight: "800", color: "#1a1a2e", fontSize: "16px" },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  vehicleChip: {
    background: "#e3f2fd",
    color: "#1565c0",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  actionBtn: {
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    color: "#555",
    marginRight: "6px",
  },
  empty: { textAlign: "center", padding: "60px", color: "#888" },
  emptyTable: { padding: "40px", textAlign: "center", color: "#888" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    background: "white",
    borderRadius: "20px",
    padding: "36px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalTitle: { margin: "0 0 24px", fontSize: "20px", color: "#1a1a2e", fontWeight: "800" },
  modalForm: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#555" },
  input: {
    padding: "11px 14px",
    border: "2px solid #e8ecf0",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    background: "white",
    color: "#555",
    fontWeight: "600",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 2,
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #e94560, #c23152)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },
};
