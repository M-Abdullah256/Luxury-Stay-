const Room = require('../models/Room');

// @desc    Get all rooms (supports filter by status, roomType, search)
// @route   GET /api/rooms
// @access  Public / Staff
exports.getAllRooms = async (req, res) => {
  try {
    const { status, roomType, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (roomType) query.roomType = roomType;

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (search) {
      query.roomNumber = { $regex: search, $options: 'i' };
    }

    const rooms = await Room.find(query).sort({ roomNumber: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single room details
// @route   GET /api/rooms/:id
// @access  Public / Staff
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin & Manager only)
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room #${roomNumber} already exists in inventory`
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Room added successfully',
      room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Admin & Manager only)
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Quick update room status (Available, Cleaning, Maintenance, etc.)
// @route   PATCH /api/rooms/:id/status
// @access  Private (Admin, Manager, Receptionist, Housekeeping)
exports.updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new status'
      });
    }

    const updateData = { status };
    if (status === 'Available') {
      updateData.lastCleanedAt = new Date();
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Room #${room.roomNumber} status changed to ${status}`,
      room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin only)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (room.status === 'Occupied') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an occupied room'
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted from inventory successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};