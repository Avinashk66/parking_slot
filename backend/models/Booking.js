const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSlot", required: true },
    bookingTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    vehicleNumber: { type: String, required: true },
    status: { type: String, enum: ["active", "cancelled", "completed"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
