const mongoose = require('mongoose');

const housekeepingTaskSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    taskType: {
      type: String,
      enum: ['Routine Cleaning', 'Deep Clean', 'Linen Change', 'Turn Down Service'],
      default: 'Routine Cleaning'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    completedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('HousekeepingTask', housekeepingTaskSchema);