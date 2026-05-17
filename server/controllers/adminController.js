// controllers/adminController.js - Admin dashboard data
const User = require("../models/User");

// @route  GET /api/admin/dashboard
// @desc   Get all users and stats for admin dashboard
// @access Private (Admin only)
const getDashboard = async (req, res) => {
  try {
    // Fetch all users (exclude passwords)
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // Calculate stats
    const totalUsers = users.length;
    const loggedInUsers = users.filter((u) => u.isLoggedIn).length;
    const loggedOutUsers = users.filter((u) => !u.isLoggedIn).length;

    // Active = logged in within last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = users.filter(
      (u) => u.lastLogin && new Date(u.lastLogin) > oneDayAgo
    ).length;

    res.status(200).json({
      stats: {
        totalUsers,
        loggedInUsers,
        loggedOutUsers,
        activeUsers,
      },
      users,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
};

module.exports = { getDashboard };
