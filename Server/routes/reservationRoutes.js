const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  createReservation,
  checkIn,
  checkOut
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All reservation routes require login

router.get('/', getAllReservations);
router.post('/', createReservation);
router.patch('/:id/check-in', checkIn);
router.patch('/:id/check-out', checkOut);

module.exports = router;