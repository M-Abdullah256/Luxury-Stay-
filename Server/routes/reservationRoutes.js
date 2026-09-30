const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  createReservation,
  checkIn,
  checkOut
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

// PUBLIC ROUTE: Aam mehmaan website se online room book kar sake (SRS Req)
router.post('/', createReservation);

// PROTECTED ROUTES: Sirf Staff hi check-in, check-out aur saari bookings dekh sake
router.get('/', protect, getAllReservations);
router.patch('/:id/check-in', protect, checkIn);
router.patch('/:id/check-out', protect, checkOut);

module.exports = router;