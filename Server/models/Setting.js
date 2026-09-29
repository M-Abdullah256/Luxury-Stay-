const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    hotelName: { type: String, default: 'LuxuryStay Hospitality' },
    taxPercentage: { type: Number, default: 13 },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },
    cancellationPolicy: { type: String, default: 'Free cancellation up to 24 hours before check-in.' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);