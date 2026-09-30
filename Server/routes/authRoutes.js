const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  createStaff,
  getAllStaff,
  toggleStaffStatus,
  updateStaff // <-- add
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.put('/staff/:id', protect, authorize('admin'), updateStaff);
// Public route
router.post('/login', login);

// Private profile route (Logged in user can see their own info)
router.get('/me', protect, getMe);

// Admin-only User/Staff Management routes (SRS Module 3)
router.post('/create-staff', protect, authorize('admin'), createStaff);
router.get('/staff', protect, authorize('admin'), getAllStaff);
router.patch('/staff/:id/toggle-status', protect, authorize('admin'), toggleStaffStatus);

module.exports = router;