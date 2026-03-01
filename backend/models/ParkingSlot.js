const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema(
  {
    slotNumber: { type: String, required: true, unique: true },
    vehicleType: { type: String, enum: ["Car", "Bike"], required: true },
    status: { type: String, enum: ["available", "occupied"], default: "available" },
    floor: { type: String, default: "G" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
