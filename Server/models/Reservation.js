const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      uppercase: true
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guest',
      required: [true, 'Guest reference is required']
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room reference is required']
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    actualCheckIn: {
      type: Date
    },
    actualCheckOut: {
      type: Date
    },
    guestsCount: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 }
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'],
      default: 'Confirmed'
    },
    roomCharges: {
      type: Number,
      required: true
    },
    keyCardIssued: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate Unique Booking Reference like LS-2026-AB12
reservationSchema.pre('save', function () {
  if (!this.bookingReference) {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `LS-${Date.now().toString().slice(-4)}-${randomChars}`;
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);