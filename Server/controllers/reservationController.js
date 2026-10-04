const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const HousekeepingTask = require('../models/HousekeepingTask'); // <-- Housekeeping Task Model

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private (Staff only)
exports.getAllReservations = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .populate('guest', 'fullName email phone idNumber')
      .populate('room', 'roomNumber roomType pricePerNight floor status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new booking / reservation with Date Validation
// @route   POST /api/reservations
// @access  Public / Staff
exports.createReservation = async (req, res) => {
  try {
    const { guestId, roomId, checkInDate, checkOutDate, guestsCount, notes } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book reservations for past dates'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.status === 'Maintenance') {
      return res.status(400).json({
        success: false,
        message: 'This room is currently under maintenance and cannot be booked.'
      });
    }

    const existingConflict = await Reservation.findOne({
      room: roomId,
      status: { $in: ['Confirmed', 'Checked-In'] },
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
      ]
    });

    if (existingConflict) {
      return res.status(400).json({
        success: false,
        message: 'Room is already reserved or occupied for the selected dates'
      });
    }

    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
    const totalRoomCharges = nights * room.pricePerNight;

    const reservation = await Reservation.create({
      guest: guestId,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount: guestsCount || { adults: 2, children: 0 },
      roomCharges: totalRoomCharges,
      notes: notes || ''
    });

    await Room.findByIdAndUpdate(roomId, { status: 'Reserved' });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Perform Guest Check-in (Automated Room Status: Occupied)
// @route   PATCH /api/reservations/:id/check-in
// @access  Private (Staff only)
exports.checkIn = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.status !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: `Cannot check-in. Current status is ${reservation.status}`
      });
    }

    reservation.status = 'Checked-In';
    reservation.actualCheckIn = new Date();
    reservation.keyCardIssued = true;
    await reservation.save();

    await Room.findByIdAndUpdate(reservation.room, { status: 'Occupied' });

    res.status(200).json({
      success: true,
      message: 'Guest successfully checked-in. Room marked as Occupied.',
      reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Perform Guest Check-out (FULLY AUTOMATED: Room ➔ Cleaning & Auto Housekeeping Task Generated!)
// @route   PATCH /api/reservations/:id/check-out
// @access  Private (Staff only)
exports.checkOut = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.status !== 'Checked-In') {
      return res.status(400).json({
        success: false,
        message: `Cannot check out. Status is currently ${reservation.status}`
      });
    }

    reservation.status = 'Checked-Out';
    reservation.actualCheckOut = new Date();
    reservation.keyCardIssued = false;
    await reservation.save();

    // 1. Room automatically becomes 'Cleaning'
    await Room.findByIdAndUpdate(reservation.room, { status: 'Cleaning' });

    // 2. AUTOMATIC HOUSEKEEPING TASK CREATION: Task list mein khud add hoga!
    const existingTask = await HousekeepingTask.findOne({
      room: reservation.room,
      status: 'Pending'
    });

    if (!existingTask) {
      await HousekeepingTask.create({
        room: reservation.room,
        taskType: 'Deep Clean',
        priority: 'High',
        status: 'Pending'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guest checked-out successfully. Room status set to Cleaning and Housekeeping notified.',
      reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Public Booking Lookup by Reference
// @route   GET /api/reservations/lookup/:reference
// @access  Public
exports.lookupReservation = async (req, res) => {
  try {
    const { reference } = req.params;
    const reservation = await Reservation.findOne({
      bookingReference: reference.toUpperCase().trim()
    })
      .populate('guest', 'fullName email phone')
      .populate('room', 'roomNumber roomType pricePerNight floor amenities description');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'No reservation found matching this booking reference code.'
      });
    }

    res.status(200).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};