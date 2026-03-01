import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/book/my-bookings");
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/book/${id}`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  const statusColor = {
    active: "#4caf50",
    cancelled: "#e94560",
    completed: "#2196f3",
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Bookings</h1>
        <span style={styles.count}>{bookings.length} total</span>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🅿️</div>
          <h3 style={{ color: "#555", marginBottom: "8px" }}>No bookings yet</h3>
          <p style={{ color: "#999" }}>Go to Dashboard to book a parking slot</p>
        </div>
      ) : (
        <div style={styles.list}>
          {bookings.map((b) => (
            <div key={b._id} style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.slotBadge}>
                  {b.slot?.vehicleType === "Car" ? "🚗" : "🏍️"} {b.slot?.slotNumber}
                </div>
                <div style={styles.vehicleNum}>{b.vehicleNumber}</div>
              </div>
              <div style={styles.cardMid}>
                <div style={styles.timeRow}>
                  <div>
                    <div style={styles.timeLabel}>Check-in</div>
                    <div style={styles.timeVal}>
                      {new Date(b.bookingTime).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  <div style={styles.arrow}>→</div>
                  <div>
                    <div style={styles.timeLabel}>Check-out</div>
                    <div style={styles.timeVal}>
                      {new Date(b.endTime).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>
                  Floor: {b.slot?.floor || "G"} | Type: {b.slot?.vehicleType}
                </div>
              </div>
              <div style={styles.cardRight}>
                <div
                  style={{
                    ...styles.statusBadge,
                    background: statusColor[b.status] + "20",
                    color: statusColor[b.status],
                    border: `1px solid ${statusColor[b.status]}40`,
                  }}
                >
                  {b.status.toUpperCase()}
                </div>
                {b.status === "active" && (
                  <button onClick={() => handleCancel(b._id)} style={styles.cancelBtn}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "24px", maxWidth: "960px", margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" },
  title: { margin: 0, fontSize: "24px", fontWeight: "800", color: "#1a1a2e" },
  count: {
    background: "#1a1a2e",
    color: "white",
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "13px",
    fontWeight: "600",
  },
  empty: { textAlign: "center", padding: "60px", color: "#888" },
  emptyCard: {
    background: "white",
    borderRadius: "16px",
    padding: "60px",
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    background: "white",
    borderRadius: "14px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    flexWrap: "wrap",
  },
  cardLeft: { minWidth: "120px" },
  slotBadge: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: "4px",
  },
  vehicleNum: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#e94560",
    background: "#fce4ec",
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "6px",
  },
  cardMid: { flex: 1, minWidth: "250px" },
  timeRow: { display: "flex", alignItems: "center", gap: "16px" },
  timeLabel: { fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase" },
  timeVal: { fontSize: "14px", fontWeight: "600", color: "#333" },
  arrow: { fontSize: "18px", color: "#ccc" },
  cardRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  cancelBtn: {
    background: "transparent",
    color: "#e94560",
    border: "1px solid #e94560",
    borderRadius: "8px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};
