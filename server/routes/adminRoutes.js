// routes/adminRoutes.js - Admin-only routes
const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin dashboard - protected + admin only
router.get("/dashboard", protect, adminOnly, getDashboard);

module.exports = router;
