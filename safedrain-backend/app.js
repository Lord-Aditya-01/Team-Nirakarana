const express = require("express");
const cors = require("cors");

const app = express(); // ✅ MUST BE FIRST

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");

// ✅ ORDER DOES NOT MATTER AFTER app IS DEFINED
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("SafeDrain backend running");
});

module.exports = app;