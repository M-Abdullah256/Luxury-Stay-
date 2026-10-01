const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Receptionist ko bhi live occupancy aur stats dekhne ki permission:
router.get('/stats', protect, authorize('admin', 'manager', 'receptionist'), getDashboardStats);

module.exports = router;