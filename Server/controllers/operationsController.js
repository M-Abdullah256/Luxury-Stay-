const HousekeepingTask = require('../models/HousekeepingTask');
const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// ===================== HOUSEKEEPING =====================

exports.getHousekeepingTasks = async (req, res) => {
  try {
    const tasks = await HousekeepingTask.find()
      .populate('room', 'roomNumber roomType floor status')
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHousekeepingTask = async (req, res) => {
  try {
    const { roomId, assignedTo, taskType, priority } = req.body;
    const task = await HousekeepingTask.create({
      room: roomId,
      assignedTo,
      taskType: taskType || 'Deep Clean',
      priority: priority || 'High'
    });

    await Room.findByIdAndUpdate(roomId, { status: 'Cleaning' });

    res.status(201).json({ success: true, message: 'Cleaning task created', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FAST CLEAN & GUARANTEED HISTORY LOGGER (With Exact Valid Enum)
exports.quickCleanRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    // 1. Room ko Available mark karein
    await Room.findByIdAndUpdate(roomId, {
      status: 'Available',
      lastCleanedAt: new Date()
    });

    // 2. Check agar pehle se pending task mojood hai
    let task = await HousekeepingTask.findOne({ room: roomId, status: 'Pending' });

    if (task) {
      task.status = 'Completed';
      task.completedAt = new Date();
      await task.save();
    } else {
      // Valid enum 'Deep Clean' use kiya hai
      task = await HousekeepingTask.create({
        room: roomId,
        taskType: 'Deep Clean',
        priority: 'High',
        status: 'Completed',
        completedAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room sanitized and recorded in history log',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeCleaningTask = async (req, res) => {
  try {
    const task = await HousekeepingTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = 'Completed';
    task.completedAt = new Date();
    await task.save();

    await Room.findByIdAndUpdate(task.room, {
      status: 'Available',
      lastCleanedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Cleaning task completed. Room is now Available.',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== MAINTENANCE =====================

exports.getMaintenanceIssues = async (req, res) => {
  try {
    const issues = await Maintenance.find()
      .populate('room', 'roomNumber roomType floor status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: issues.length, issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reportMaintenanceIssue = async (req, res) => {
  try {
    const { roomId, issueTitle, description, priority, reportedBy } = req.body;

    const issue = await Maintenance.create({
      room: roomId,
      issueTitle,
      description,
      priority,
      reportedBy
    });

    await Room.findByIdAndUpdate(roomId, { status: 'Maintenance' });

    res.status(201).json({ success: true, message: 'Issue reported', issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resolveMaintenanceIssue = async (req, res) => {
  try {
    const issue = await Maintenance.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    issue.status = 'Resolved';
    issue.resolvedAt = new Date();
    await issue.save();

    await Room.findByIdAndUpdate(issue.room, { status: 'Available' });

    res.status(200).json({
      success: true,
      message: 'Maintenance resolved. Room is now Available.',
      issue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};