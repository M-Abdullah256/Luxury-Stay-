const express = require('express');
const router = express.Router();
const {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest
} = require('../controllers/guestController');
const { protect } = require('../middleware/authMiddleware');

// PUBLIC ROUTE: Mehmaan website se apni profile create kar sake
router.post('/', createGuest);

// PROTECTED ROUTES: Sirf logged-in Staff hi guests ki list dekh sake ya edit kar sake
router.get('/', protect, getAllGuests);
router.get('/:id', protect, getGuestById);
router.put('/:id', protect, updateGuest);

module.exports = router;