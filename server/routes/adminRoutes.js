const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  registerAdmin,
  loginAdmin,
  getProfile,
  getDashboardStats,
  getAstrologers,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
  // Users Controllers
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  // Orders Controllers
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/adminController");

const router = express.Router();

/* ==================================
   ADMIN AUTH ROUTES
================================== */

// Register Admin
router.post("/register", registerAdmin);

// Login Admin
router.post("/login", loginAdmin);

/* ==================================
   ADMIN PROFILE
================================== */

// Get Logged In Admin Profile
router.get("/profile", auth, getProfile);

/* ==================================
   DASHBOARD
================================== */

// Dashboard Stats
router.get("/dashboard", auth, getDashboardStats);

/* ==================================
   ASTROLOGERS MANAGEMENT
================================== */

// Get All Astrologers
router.get("/astrologers", auth, getAstrologers);

// Create New Astrologer
router.post("/astrologer", auth, upload.single("image"), createAstrologer);

// Update Astrologer
router.put("/astrologer/:id", auth, upload.single("image"), updateAstrologer);

// Delete Astrologer
router.delete("/astrologer/:id", auth, deleteAstrologer);

/* ==================================
   USERS MANAGEMENT
================================== */

// Get All Users
router.get("/users", auth, getUsers);

// Get Single User by ID
router.get("/users/:id", auth, getUserById);

// Update User
router.put("/users/:id", auth, updateUser);

// Delete User
router.delete("/users/:id", auth, deleteUser);

/* ==================================
   ORDERS MANAGEMENT
================================== */

// Get All Orders
router.get("/orders", auth, getOrders);

// Get Single Order by ID
router.get("/orders/:id", auth, getOrderById);

// Update Order Status
router.put("/orders/:id", auth, updateOrder);

// Delete Order
router.delete("/orders/:id", auth, deleteOrder);

module.exports = router;