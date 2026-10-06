const Feedback = require('../models/Feedback');
const ServiceRequest = require('../models/ServiceRequest');
const Setting = require('../models/Setting');
const Notification = require('../models/Notification');
const Room = require('../models/Room');
const Guest = require('../models/Guest');


// ===================== FEEDBACK =====================
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('guest', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: feedback.length, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== SERVICE REQUESTS =====================
exports.getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('room', 'roomNumber floor')
      .populate('guest', 'fullName phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createServiceRequest = async (req, res) => {
  try {
    let { room, guest, roomNumber, guestName, serviceType, details } = req.body;

    // 1. Room number se Room ki MongoDB ID dhoondein
    if (!room && roomNumber) {
      const cleanNum = roomNumber.toString().replace(/[^0-9]/g, '');
      const foundRoom = await Room.findOne({
        $or: [
          { roomNumber: roomNumber.toString().trim() },
          { roomNumber: cleanNum }
        ]
      });
      if (foundRoom) {
        room = foundRoom._id;
      } else {
        return res.status(404).json({ 
          success: false, 
          message: `Suite #${roomNumber} not found. Please enter a valid room number.` 
        });
      }
    }

    // 2. Guest Name se Guest ki MongoDB ID dhoondein (ya create karein)
    if (!guest && guestName) {
      let foundGuest = await Guest.findOne({ fullName: new RegExp(`^${guestName.trim()}$`, 'i') });
      if (!foundGuest) {
       foundGuest = await Guest.create({
          fullName: guestName.trim(),
          email: `guest_${Date.now()}@luxurystay.com`,
          phone: '+0000000000',
          idNumber: `CONCIERGE-${Date.now().toString().slice(-6)}` // 👈 Yeh lazmi tha
        });
      }
      guest = foundGuest._id;
    }

    // 3. Service Request create karein
    const request = await ServiceRequest.create({
      room,
      guest,
      serviceType: serviceType || 'Wake-up Call',
      details: details || '',
      status: 'Requested'
    });

    // Auto notification for staff
    await Notification.create({
      title: 'New Service Request',
      message: `${request.serviceType} requested for room.`,
      type: 'System'
    });

    res.status(201).json({
      success: true,
      message: 'Service requested successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServiceStatus = async (req, res) => {
  try {
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(200).json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== SETTINGS =====================
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, {
        new: true
      });
    }
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== NOTIFICATIONS =====================
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};