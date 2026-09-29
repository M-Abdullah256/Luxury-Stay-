const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    serviceType: {
      type: String,
      enum: ['Wake-up Call', 'Airport Transportation', 'Room Service', 'Extra Linens', 'Luggage Assistance'],
      required: true
    },
    details: { type: String, default: '' },
    scheduledTime: Date,
    status: {
      type: String,
      enum: ['Requested', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Requested'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);