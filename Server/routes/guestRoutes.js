const express = require('express');
const router = express.Router();
const {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest
} = require('../controllers/guestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All guest routes require login

router.get('/', getAllGuests);
router.get('/:id', getGuestById);
router.post('/', createGuest);
router.put('/:id', updateGuest);

module.exports = router;