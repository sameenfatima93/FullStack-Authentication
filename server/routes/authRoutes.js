// routes/authRoutes.js - Authentication routes
const express = require("express");
const router = express.Router();
const { signup, login, logout, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes (require valid JWT)
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);

module.exports = router;
