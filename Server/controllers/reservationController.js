const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

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

// @desc    Create new booking / reservation
// @route   POST /api/reservations
// @access  Private (Staff only)
exports.createReservation = async (req, res) => {
  try {
    const { guestId, roomId, checkInDate, checkOutDate, guestsCount, notes } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Check if room exists and is not under maintenance
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

    // Date Overlap Validation: check if already booked for these dates
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

    // Total nights & price calculation
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalRoomCharges = nights * room.pricePerNight;

    const reservation = await Reservation.create({
      guest: guestId,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount,
      roomCharges: totalRoomCharges,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Perform Guest Check-in (SRS Requirement: Automated Room Status Update)
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

    // Update reservation
    reservation.status = 'Checked-In';
    reservation.actualCheckIn = new Date();
    reservation.keyCardIssued = true;
    await reservation.save();

    // Automatically mark Room as 'Occupied'
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

// @desc    Perform Guest Check-out (SRS Requirement: Automatically triggers Room Cleaning)
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

    // Update reservation
    reservation.status = 'Checked-Out';
    reservation.actualCheckOut = new Date();
    reservation.keyCardIssued = false;
    await reservation.save();

    // Automatically mark Room as 'Cleaning' as required by SRS!
    await Room.findByIdAndUpdate(reservation.room, { status: 'Cleaning' });

    res.status(200).json({
      success: true,
      message: 'Guest checked-out successfully. Room status set to Cleaning.',
      reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};