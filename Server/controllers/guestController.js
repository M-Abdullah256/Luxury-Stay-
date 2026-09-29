const Guest = require('../models/Guest');

// @desc    Get all guests (search by name, email, phone)
// @route   GET /api/guests
// @access  Private (Staff only)
exports.getAllGuests = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { idNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const guests = await Guest.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: guests.length,
      guests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single guest details
// @route   GET /api/guests/:id
// @access  Private (Staff only)
exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest profile not found' });
    }

    res.status(200).json({ success: true, guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new guest profile
// @route   POST /api/guests
// @access  Private (Staff only)
exports.createGuest = async (req, res) => {
  try {
    const { email } = req.body;

    const existingGuest = await Guest.findOne({ email });
    if (existingGuest) {
      return res.status(400).json({
        success: false,
        message: 'A guest with this email already exists'
      });
    }

    const guest = await Guest.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Guest profile created successfully',
      guest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update guest profile
// @route   PUT /api/guests/:id
// @access  Private (Staff only)
exports.updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Guest profile updated',
      guest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};