const Feedback = require('../models/Feedback');
const ServiceRequest = require('../models/ServiceRequest');
const Setting = require('../models/Setting');
const Notification = require('../models/Notification');

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
    const request = await ServiceRequest.create(req.body);

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