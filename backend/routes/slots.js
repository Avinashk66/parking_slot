const express = require("express");
const router = express.Router();
const ParkingSlot = require("../models/ParkingSlot");
const { auth, adminOnly } = require("../middleware/auth");

// GET all slots
router.get("/", auth, async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ slotNumber: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create slot (admin)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { slotNumber, vehicleType, floor } = req.body;
    const existing = await ParkingSlot.findOne({ slotNumber });
    if (existing) return res.status(400).json({ message: "Slot number already exists" });

    const slot = await ParkingSlot.create({ slotNumber, vehicleType, floor });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update slot (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const slot = await ParkingSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE slot (admin)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await ParkingSlot.findByIdAndDelete(req.params.id);
    res.json({ message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
