const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom
} = require('../controllers/roomController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public/Staff access to see rooms
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Protected routes (Admin & Manager can create/edit)
router.post('/', protect, authorize('admin', 'manager'), createRoom);
router.put('/:id', protect, authorize('admin', 'manager'), updateRoom);

// Status change route (Accessible by Housekeeping & Receptionist also)
router.patch(
  '/:id/status',
  protect,
  authorize('admin', 'manager', 'receptionist', 'housekeeping'),
  updateRoomStatus
);

// Delete room (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteRoom);

module.exports = router;