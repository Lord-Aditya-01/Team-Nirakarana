const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

// ===============================
// SERVER + SOCKET SETUP
// ===============================
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);

// ===============================
// SOCKET LOGIC
// ===============================
require("./socket/socket")(io);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("SafeDrain backend running");
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});