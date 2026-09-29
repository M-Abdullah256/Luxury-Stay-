const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Guest full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Guest email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Guest phone number is required'],
      trim: true
    },
    idType: {
      type: String,
      enum: ['Passport', 'National ID', 'Driving License'],
      default: 'National ID'
    },
    idNumber: {
      type: String,
      required: [true, 'Identity document number is required'],
      trim: true
    },
    address: {
      city: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    preferences: {
      type: [String],
      default: [] // e.g. ["Non-smoking", "High floor", "Late check-out"]
    },
    specialRequests: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Guest', guestSchema);