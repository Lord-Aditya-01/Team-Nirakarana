require("dotenv").config();

const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// load socket logic
require("./socket/socket")(io);

// connect database
connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});