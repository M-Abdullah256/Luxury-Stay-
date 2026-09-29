const HousekeepingTask = require('../models/HousekeepingTask');
const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// --- HOUSEKEEPING ---

exports.getHousekeepingTasks = async (req, res) => {
  try {
    const tasks = await HousekeepingTask.find()
      .populate('room', 'roomNumber roomType floor status')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

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
      taskType,
      priority
    });

    // Mark room status to 'Cleaning'
    await Room.findByIdAndUpdate(roomId, { status: 'Cleaning' });

    res.status(201).json({ success: true, message: 'Cleaning task created', task });
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

    // SRS Requirement: Once cleaned, Room automatically becomes Available!
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

// --- MAINTENANCE ---

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

    // Mark Room status to 'Maintenance'
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

    // Mark room back to Available
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