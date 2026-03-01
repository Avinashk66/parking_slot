import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    bookingTime: "",
    endTime: "",
    vehicleNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const { data } = await api.get("/slots");
      setSlots(data);
    } catch (err) {
      toast.error("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      await api.post("/book", { slotId: selectedSlot._id, ...bookingForm });
      toast.success(`Slot ${selectedSlot.slotNumber} booked successfully!`);
      setSelectedSlot(null);
      setBookingForm({ bookingTime: "", endTime: "", vehicleNumber: "" });
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const available = slots.filter((s) => s.status === "available").length;
  const occupied = slots.filter((s) => s.status === "occupied").length;

  const filtered = slots.filter((s) => {
    const statusMatch = filter === "all" || s.status === filter;
    const typeMatch = typeFilter === "all" || s.vehicleType === typeFilter;
    return statusMatch && typeMatch;
  });

  return (
    <div style={styles.page}>
      {/* Stats */}
      <div style={styles.stats}>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #4caf50" }}>
          <div style={styles.statNum}>{available}</div>
          <div style={styles.statLabel}>Available</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #e94560" }}>
          <div style={styles.statNum}>{occupied}</div>
          <div style={styles.statLabel}>Occupied</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #2196f3" }}>
          <div style={styles.statNum}>{slots.length}</div>
          <div style={styles.statLabel}>Total Slots</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #ff9800" }}>
          <div style={styles.statNum}>
            {slots.length ? Math.round((available / slots.length) * 100) : 0}%
          </div>
          <div style={styles.statLabel}>Availability</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Status:</span>
          {["all", "available", "occupied"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? "#1a1a2e" : "white",
                color: filter === f ? "white" : "#555",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Type:</span>
          {["all", "Car", "Bike"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                ...styles.filterBtn,
                background: typeFilter === t ? "#1a1a2e" : "white",
                color: typeFilter === t ? "white" : "#555",
              }}
            >
              {t === "all" ? "All" : t === "Car" ? "🚗 Car" : "🏍️ Bike"}
            </button>
          ))}
        </div>
      </div>

      {/* Slots Grid */}
      {loading ? (
        <div style={styles.loading}>Loading slots...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No slots found. Adjust your filters.</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((slot) => (
            <div
              key={slot._id}
              onClick={() => slot.status === "available" && setSelectedSlot(slot)}
              style={{
                ...styles.slotCard,
                background: slot.status === "available"
                  ? "linear-gradient(135deg, #e8f5e9, #c8e6c9)"
                  : "linear-gradient(135deg, #fce4ec, #f8bbd0)",
                border: slot.status === "available" ? "2px solid #4caf50" : "2px solid #e94560",
                cursor: slot.status === "available" ? "pointer" : "not-allowed",
                transform: slot.status === "available" ? "scale(1)" : "scale(1)",
              }}
            >
              <div style={styles.slotNum}>{slot.slotNumber}</div>
              <div style={styles.slotIcon}>{slot.vehicleType === "Car" ? "🚗" : "🏍️"}</div>
              <div style={styles.slotType}>{slot.vehicleType}</div>
              <div
                style={{
                  ...styles.slotStatus,
                  background: slot.status === "available" ? "#4caf50" : "#e94560",
                }}
              >
                {slot.status === "available" ? "✓ Available" : "✗ Occupied"}
              </div>
              {slot.floor && <div style={styles.slotFloor}>Floor: {slot.floor}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedSlot && (
        <div style={styles.overlay} onClick={() => setSelectedSlot(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Book Slot {selectedSlot.slotNumber}</h2>
            <p style={styles.modalSub}>
              {selectedSlot.vehicleType === "Car" ? "🚗" : "🏍️"} {selectedSlot.vehicleType} Parking
              {selectedSlot.floor && ` | Floor ${selectedSlot.floor}`}
            </p>
            <form onSubmit={handleBook} style={styles.modalForm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Vehicle Number</label>
                <input
                  type="text"
                  placeholder="e.g. TN01AB1234"
                  value={bookingForm.vehicleNumber}
                  onChange={(e) => setBookingForm({ ...bookingForm, vehicleNumber: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="datetime-local"
                  value={bookingForm.bookingTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                  style={styles.input}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>End Time</label>
                <input
                  type="datetime-local"
                  value={bookingForm.endTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                  style={styles.input}
                  required
                  min={bookingForm.bookingTime || new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setSelectedSlot(null)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={booking} style={styles.confirmBtn}>
                  {booking ? "Booking..." : "Confirm Booking"}
                </button>
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
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  statNum: { fontSize: "32px", fontWeight: "800", color: "#1a1a2e" },
  statLabel: { fontSize: "13px", color: "#888", marginTop: "4px", fontWeight: "500" },
  filters: {
    background: "white",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "24px",
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    alignItems: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  filterGroup: { display: "flex", alignItems: "center", gap: "8px" },
  filterLabel: { fontSize: "13px", color: "#888", fontWeight: "600" },
  filterBtn: {
    padding: "6px 14px",
    border: "1px solid #e0e0e0",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px",
  },
  slotCard: {
    borderRadius: "14px",
    padding: "20px 16px",
    textAlign: "center",
    transition: "all 0.2s",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  slotNum: { fontSize: "20px", fontWeight: "800", color: "#1a1a2e", marginBottom: "8px" },
  slotIcon: { fontSize: "28px", marginBottom: "4px" },
  slotType: { fontSize: "12px", color: "#555", fontWeight: "500", marginBottom: "8px" },
  slotStatus: {
    display: "inline-block",
    color: "white",
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "12px",
    marginBottom: "4px",
  },
  slotFloor: { fontSize: "11px", color: "#777", marginTop: "4px" },
  loading: { textAlign: "center", padding: "60px", color: "#888", fontSize: "16px" },
  empty: {
    textAlign: "center",
    padding: "60px",
    color: "#888",
    fontSize: "16px",
    background: "white",
    borderRadius: "12px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "20px",
  },
  modal: {
    background: "white",
    borderRadius: "20px",
    padding: "36px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalTitle: { margin: "0 0 4px", fontSize: "22px", color: "#1a1a2e", fontWeight: "800" },
  modalSub: { color: "#888", marginBottom: "24px", fontSize: "14px" },
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
    fontSize: "14px",
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
    fontSize: "14px",
  },
};
