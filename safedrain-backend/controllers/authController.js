const Worker = require("../models/Worker");

exports.register = async (req, res) => {
  try {
    console.log("Signup API HIT:", req.body); // debug

    const {
      name,
      workerId,
      password,
      mobile,
      emergencyContact
    } = req.body;

    // ✅ validation
    if (!name || !workerId || !password) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // check duplicate
    const exists = await Worker.findOne({ workerId });

    if (exists) {
      return res.status(400).json({
        message: "Worker already exists"
      });
    }

    const worker = await Worker.create({
      name,
      workerId,
      password,
      mobile,
      emergencyContact
    });

    res.status(201).json({
      message: "Signup successful",
      worker
    });

  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).json({
      message: "Registration failed"
    });
  }
};