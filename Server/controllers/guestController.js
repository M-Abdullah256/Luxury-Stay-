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

// @desc    Create or Retrieve Existing Guest (Smart Returning Guest Handler)
// @route   POST /api/guests
// @access  Public / Staff
exports.createGuest = async (req, res) => {
  try {
    const { fullName, email, phone, idNumber, idType, address, preferences } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Guest email is required' });
    }

    // Check agar mehmaan pehle se database mein mojood hai (Returning Guest)
    let guest = await Guest.findOne({ email: email.toLowerCase().trim() });

    if (guest) {
      // Purane guest ki info update karein aur wahi profile return karein
      if (fullName) guest.fullName = fullName;
      if (phone) guest.phone = phone;
      if (idNumber) guest.idNumber = idNumber;
      await guest.save();

      return res.status(200).json({
        success: true,
        message: 'Returning guest profile linked successfully',
        guest
      });
    }

    // Naya Guest profile banayein
    guest = await Guest.create({
      fullName,
      email: email.toLowerCase().trim(),
      phone,
      idType: idType || 'National ID',
      idNumber: idNumber || 'ONLINE-BOOK',
      address,
      preferences
    });

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
// @desc    Delete guest profile
// @route   DELETE /api/guests/:id
// @access  Private (Staff only)
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Guest profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};