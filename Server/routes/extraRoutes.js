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

router.use(protect);

// Feedback
router.get('/feedback', getAllFeedback);
router.post('/feedback', createFeedback);

// Services
router.get('/services', getAllServiceRequests);
router.post('/services', createServiceRequest);
router.patch('/services/:id/status', updateServiceStatus);

// Settings (Admin only)
router.get('/settings', getSettings);
router.put('/settings', authorize('admin'), updateSettings);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

module.exports = router;