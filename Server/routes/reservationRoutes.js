const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  createReservation,
  checkIn,
  checkOut,
  lookupReservation
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

// PUBLIC ROUTES (No Login Required)
router.post('/', createReservation);
router.get('/lookup/:reference', lookupReservation);

// PROTECTED ROUTES (Staff Only)
router.get('/', protect, getAllReservations);
router.patch('/:id/check-in', protect, checkIn);
router.patch('/:id/check-out', protect, checkOut);

module.exports = router;