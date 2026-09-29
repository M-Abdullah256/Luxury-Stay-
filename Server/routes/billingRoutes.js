const express = require('express');
const router = express.Router();
const {
  generateBill,
  addServiceCharge,
  markAsPaid,
  getAllBills
} = require('../controllers/billingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllBills);
router.post('/generate/:reservationId', generateBill);
router.post('/:billId/add-service', addServiceCharge);
router.patch('/:billId/pay', markAsPaid);

module.exports = router;