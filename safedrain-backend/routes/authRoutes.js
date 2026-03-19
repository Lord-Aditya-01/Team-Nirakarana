const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");

// health check
router.get("/", (req, res) => {
  res.send("Auth route working");
});

// ✅ SIGNUP ROUTE
router.post("/signup", register);

module.exports = router;