const Bill = require('../models/Bill');
const Reservation = require('../models/Reservation');

// @desc    Generate or get Bill for a reservation
// @route   POST /api/billing/generate/:reservationId
// @access  Private (Staff)
exports.generateBill = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findById(reservationId).populate('guest room');
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Check agar bill pehle se exist karta hai
    let bill = await Bill.findOne({ reservation: reservationId });

    if (!bill) {
      bill = new Bill({
        reservation: reservation._id,
        guest: reservation.guest._id,
        roomCharges: reservation.roomCharges,
        additionalServices: []
      });
      await bill.save();
    }

    res.status(200).json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add additional service charge (Food, Laundry, etc.)
// @route   POST /api/billing/:billId/add-service
// @access  Private (Staff)
exports.addServiceCharge = async (req, res) => {
  try {
    const { serviceName, amount } = req.body;
    const bill = await Bill.findById(req.params.billId);

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    bill.additionalServices.push({ serviceName, amount: Number(amount) });
    await bill.save();

    res.status(200).json({
      success: true,
      message: 'Service added to invoice',
      bill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pay and finalize Bill
// @route   PATCH /api/billing/:billId/pay
// @access  Private (Staff)
exports.markAsPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const bill = await Bill.findById(req.params.billId);

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    bill.paymentStatus = 'Paid';
    bill.paymentMethod = paymentMethod || 'Credit Card';
    bill.paidAt = new Date();
    await bill.save();

    res.status(200).json({
      success: true,
      message: 'Payment received successfully. Invoice finalized.',
      bill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bills / invoices
// @route   GET /api/billing
// @access  Private (Staff)
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('guest', 'fullName email phone')
      .populate({
        path: 'reservation',
        populate: { path: 'room', select: 'roomNumber roomType' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bills.length, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Delete a bill / invoice
// @route   DELETE /api/billing/:billId
// @access  Private (Admin)
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.billId);

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice folio not found' });
    }

    res.status(200).json({ success: true, message: 'Invoice folio deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};