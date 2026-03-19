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

require("./socket/socket")(io);

// connect database
connectDB();

app.get("/test", async (req, res) => {
  try {
    const Worker = require("./models/Worker");

    const data = await Worker.create({
      name: "Harshini",
      workerId: "W001",
      password: "123456",
      mobile: "9876543210",
      emergencyContact: "9123456780"
    });

    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
