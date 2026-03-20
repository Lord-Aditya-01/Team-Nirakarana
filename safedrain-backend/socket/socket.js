const Location = require("../models/Location");
const Worker = require("../models/Worker");
const { spawn } = require("child_process");

const workersState = {};

// ===============================
// 🧠 AI FUNCTION
// ===============================
function runAI(workerData) {
  return new Promise((resolve) => {

    const py = spawn("python", ["../ai-engine/run_pipeline.py"]);

    let result = "";

    py.stdin.write(JSON.stringify(workerData));
    py.stdin.end();

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.log("PYTHON ERROR:", data.toString());
    });



    py.on("close", () => {
      try {
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch (e) {
        console.log("AI ERROR:", e);
        resolve(null);
      }
    });

    if (aiResult && aiResult.final_status === "DANGER") {
      io.emit("new-alert", {
          message: "🚨 DANGER: Unsafe sewer conditions!"
      });
    }

  });
}

// ===============================
// 🚀 SOCKET MAIN
// ===============================
module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    // ===============================
    // ✅ AUTO JOIN SUPERVISOR
    // ===============================
    if (socket.handshake.query.role === "supervisor") {
      socket.join("supervisors");
    }

    // ===============================
    // ✅ SUPERVISOR LOGIN
    // ===============================
    socket.on("supervisor-login", ({ username, password }) => {

      if (username === "supervisor" && password === "admin123") {
        socket.role = "supervisor";
        socket.join("supervisors");
        socket.emit("supervisor-login-success");
      } else {
        socket.emit("supervisor-login-failed");
      }

    });

    socket.on("check-supervisor-auth", () => {
      socket.emit("supervisor-auth-result", socket.role === "supervisor");
    });

    // ===============================
    // ✅ WORKER SIGNUP
    // ===============================
    socket.on("worker-signup", async (data) => {

      try {
        const { name, workerId, password, mobile, emergencyContact } = data;

        if (!name || !workerId || !password) {
          socket.emit("worker-signup-failed", "Missing fields");
          return;
        }

        const exists = await Worker.findOne({ workerId });

        if (exists) {
          socket.emit("worker-signup-failed", "Worker exists");
          return;
        }

        const worker = await Worker.create({
          name,
          workerId,
          password,
          mobile,
          emergencyContact
        });

        socket.emit("worker-signup-success", worker);

      } catch (err) {
        console.log(err);
        socket.emit("worker-signup-failed", "Error");
      }

    });

    // ===============================
    // ✅ WORKER LOGIN
    // ===============================
    socket.on("worker-login", async ({ workerId, password }) => {

      const worker = await Worker.findOne({ workerId });

      if (!worker || worker.password !== password) {
        socket.emit("worker-login-failed");
        return;
      }

      socket.role = "worker";
      socket.workerId = workerId;

      workersState[workerId] = {
        id: workerId,
        workerId,
        name: worker.name,
        mobile: worker.mobile,
        emergencyContact: worker.emergencyContact,
        status: "NORMAL",
        online: true
      };

      socket.emit("worker-login-success", workersState[workerId]);

    });

    // ===============================
    // ✅ GET SESSION
    // ===============================
    socket.on("get-worker-session", () => {
      if (socket.role !== "worker") return;
      socket.emit("worker-session-data", workersState[socket.workerId]);
    });

    // ===============================
    // ✅ SUPERVISOR JOIN
    // ===============================
    socket.on("join-supervisor", () => {
      socket.join("supervisors");
      socket.emit("initial-workers", Object.values(workersState));
    });

    // ===============================
    // ✅ LOCATION UPDATE
    // ===============================
    socket.on("worker-location-update", async (data) => {

      const id = socket.workerId;
      if (!id) return;

      workersState[id] = {
        ...workersState[id],
        lat: data.latitude,
        lng: data.longitude,
        updatedAt: Date.now()
      };

      await Location.create({
        workerId: id,
        latitude: data.latitude,
        longitude: data.longitude
      });

      io.to("supervisors").emit("receive-location", workersState[id]);

    });

    // ===============================
    // ✅ GAS UPDATE (OPTIONAL)
    // ===============================
    socket.on("worker-gas-update", async (data) => {

      const id = socket.workerId;
      if (!id) return;

      workersState[id] = {
        ...workersState[id],
        ...data
      };

      const aiResult = await runAI(workersState[id]);

      if (aiResult) {
        workersState[id] = {
          ...workersState[id],
          ...aiResult
        };
      }

      io.to("supervisors").emit("receive-location", workersState[id]);

    });

    // ===============================
    // ✅ SOS
    // ===============================
    socket.on("worker-sos", () => {

      const id = socket.workerId;
      if (!id) return;

      workersState[id].status = "EMERGENCY";

      io.to("supervisors").emit("receive-location", workersState[id]);

      io.to("supervisors").emit("new-alert", {
        type: "SOS",
        workerId: id,
        message: "Emergency",
        time: Date.now()
      });

    });

    // ===============================
    // ✅ LOGOUT
    // ===============================
    socket.on("worker-logout", () => {

      if (socket.workerId) {
        delete workersState[socket.workerId];

        io.to("supervisors").emit("worker-offline", {
          workerId: socket.workerId
        });
      }

    });

    // ===============================
    // ✅ DISCONNECT
    // ===============================
    socket.on("disconnect", () => {

      if (socket.workerId && workersState[socket.workerId]) {

        delete workersState[socket.workerId];

        io.to("supervisors").emit("worker-offline", {
          workerId: socket.workerId
        });
      }

    });

    // ===============================
    // ✅ AUTH CHECK
    // ===============================
    socket.on("check-worker-auth", () => {
      socket.emit("worker-auth-result", socket.role === "worker");
    });

  });

};