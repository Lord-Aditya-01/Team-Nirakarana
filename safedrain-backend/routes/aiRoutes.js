const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");

// ===============================
// 📁 FILE UPLOAD CONFIG
// ===============================
const upload = multer({ dest: "uploads/" });

// ===============================
// 🚀 AI UPLOAD ROUTE
// ===============================
router.post("/upload", upload.single("file"), (req, res) => {

  // ❌ No file check
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;

  console.log("📂 Uploaded file:", filePath);

  // ===============================
  // 🧠 RUN PYTHON AI ENGINE
  // ===============================
  const py = spawn("python", [
    path.join(__dirname, "../../ai-engine/run_pipeline.py"),
    filePath
  ]);

  let output = "";

  // ===============================
  // 📤 CAPTURE OUTPUT
  // ===============================
  py.stdout.on("data", (data) => {
    const text = data.toString();
    console.log("STDOUT:", text);
    output += text;
  });

  py.stderr.on("data", (data) => {
    console.log("STDERR:", data.toString());
  });

  // ===============================
  // ✅ FINAL RESPONSE
  // ===============================
  py.on("close", (code) => {
    try {
      console.log("🔍 RAW OUTPUT:\n", output);

      // 🔥 BEST METHOD → get LAST JSON only
      const startIndex = output.lastIndexOf("[");

      if (startIndex === -1) {
        throw new Error("No JSON found in output");
      }

      const jsonString = output.slice(startIndex);

      console.log("✅ FINAL JSON:\n", jsonString);

      const parsed = JSON.parse(jsonString);

      return res.json(parsed);

    } catch (err) {
      console.log("❌ PARSE ERROR:", err);

      return res.status(500).json({
        error: "AI processing failed",
        raw: output
      });
    }
  });

});

module.exports = router;