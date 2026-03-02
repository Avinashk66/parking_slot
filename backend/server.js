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

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
}

// Connect to MongoDB
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
console.log("✅ MongoDB connected");
 app.listen(process.env.PORT || 8080, () =>
 console.log(`🚀 Server running on port ${process.env.PORT || 8080}`)
 );
})
.catch((err) => console.error("MongoDB connection error:", err));