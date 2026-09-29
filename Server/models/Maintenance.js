const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    issueTitle: {
      type: String,
      required: [true, 'Please provide issue title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please describe the problem']
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending'
    },
    reportedBy: {
      type: String,
      default: 'Staff'
    },
    resolvedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);