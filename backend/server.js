const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/slots", require("./routes/slots"));
app.use("/api/book", require("./routes/bookings"));

/**
 * PRODUCTION SETTING:
 * This block serves the React frontend from the 'frontend/build' directory.
 * It must come AFTER your API routes.
 */
if (process.env.NODE_ENV === "production") {
  // Use '../frontend/build' because server.js is inside the 'backend' folder
  const frontendPath = path.join(__dirname, "../frontend/build");
  
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // Defaulting to 8080 for Azure compatibility
    const PORT = process.env.PORT || 8080; 
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));