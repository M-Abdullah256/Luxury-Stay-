const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      enum: {
        values: ['Standard', 'Deluxe', 'Suite', 'Executive Suite', 'Presidential Suite'],
        message: '{VALUE} is not a valid room type'
      }
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative']
    },
    capacity: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 0, min: 0 }
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required']
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved'],
        message: '{VALUE} is not a recognized status'
      },
      default: 'Available'
    },
    amenities: {
      type: [String],
      default: ['High-speed WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar']
    },
    description: {
      type: String,
      trim: true,
      default: 'Luxury and comfort tailored for your stay.'
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      ]
    },
    lastCleanedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Search optimization indexing
roomSchema.index({ status: 1, roomType: 1 });

module.exports = mongoose.model('Room', roomSchema);