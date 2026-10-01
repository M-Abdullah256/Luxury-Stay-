const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  createFeedback,
  getAllServiceRequests,
  createServiceRequest,
  updateServiceStatus,
  getSettings,
  updateSettings,
  getNotifications,
  markNotificationRead
} = require('../controllers/extraController');
const { protect, authorize } = require('../middleware/authMiddleware');

// PUBLIC ROUTES (Guests can view and submit reviews)
router.get('/feedback', getAllFeedback); // <-- Public: taake website par reviews dikhein
router.post('/feedback', createFeedback);
router.post('/services', createServiceRequest);

// PROTECTED ROUTES (Staff Only)
router.get('/services', protect, getAllServiceRequests);
router.patch('/services/:id/status', protect, updateServiceStatus);

// Settings (Admin only)
router.get('/settings', protect, getSettings);
router.put('/settings', protect, authorize('admin'), updateSettings);

// Notifications
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;