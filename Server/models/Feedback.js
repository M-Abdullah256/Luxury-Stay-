const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
    ratings: {
      cleanliness: { type: Number, min: 1, max: 5, default: 5 },
      service: { type: Number, min: 1, max: 5, default: 5 },
      roomComfort: { type: Number, min: 1, max: 5, default: 5 },
      overall: { type: Number, min: 1, max: 5, default: 5 }
    },
    comments: { type: String, required: [true, 'Please provide feedback comments'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);