const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const { auth, adminOnly } = require("../middleware/auth");

// POST book a slot
router.post("/", auth, async (req, res) => {
  try {
    const { slotId, bookingTime, endTime, vehicleNumber } = req.body;

    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.status === "occupied") return res.status(400).json({ message: "Slot already occupied" });

    // Check for time conflicts
    const conflict = await Booking.findOne({
      slot: slotId,
      status: "active",
      $or: [
        { bookingTime: { $lt: new Date(endTime), $gte: new Date(bookingTime) } },
        { endTime: { $gt: new Date(bookingTime), $lte: new Date(endTime) } },
        { bookingTime: { $lte: new Date(bookingTime) }, endTime: { $gte: new Date(endTime) } },
      ],
    });

    if (conflict) return res.status(400).json({ message: "Slot already booked for this time" });

    const booking = await Booking.create({
      user: req.user.id,
      slot: slotId,
      bookingTime,
      endTime,
      vehicleNumber,
    });

    // Mark slot occupied
    slot.status = "occupied";
    await slot.save();

    await booking.populate(["user", "slot"]);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my bookings
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("slot")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all bookings (admin)
router.get("/all", auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("slot")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE cancel booking
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only owner or admin can cancel
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    booking.status = "cancelled";
    await booking.save();

    // Free the slot
    await ParkingSlot.findByIdAndUpdate(booking.slot, { status: "available" });

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
