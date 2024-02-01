import express, { Router } from "express";
import {
  authenticateUser,
  getAdminProfile,
  getAllUsers,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController";
import { adminAuth, protect } from "../middleware/isAuthenticated";

const router: Router = express.Router();

// Public Routes
// Register
router.route("/register").post(registerUser);
// Login
router.route("/login").post(authenticateUser);
// Logout
router.route("/logout").post(logoutUser);

// Protected Routes
// Get all users (admin)
router.route("/").get(protect, adminAuth, getAllUsers);

// Get Admin profile
router.route("/admin/profile").get(adminAuth, getAdminProfile);

// Update User profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
