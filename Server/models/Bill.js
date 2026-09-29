const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      uppercase: true
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guest',
      required: true
    },
    roomCharges: {
      type: Number,
      required: true,
      default: 0
    },
    additionalServices: [
      {
        serviceName: { type: String, required: true }, // e.g., 'Food - Room Service', 'Laundry'
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now }
      }
    ],
    subtotal: {
      type: Number,
      default: 0
    },
    taxRate: {
      type: Number,
      default: 13 // 13% Luxury Tax / Sales Tax
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'Online Transfer'],
      default: 'Credit Card'
    },
    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Auto generate invoice number & calculate total
billSchema.pre('save', function () {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  }

  const additionalTotal = this.additionalServices.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );

  this.subtotal = Number(this.roomCharges) + additionalTotal;
  this.taxAmount = (this.subtotal * this.taxRate) / 100;
  this.totalAmount = this.subtotal + this.taxAmount;
});

module.exports = mongoose.model('Bill', billSchema);