const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const Bill = require('../models/Bill');
const Guest = require('../models/Guest');

// @desc    Management Dashboard Metrics & Analytics (SRS Modules 13 & 14)
// @route   GET /api/dashboard/stats
// @access  Private (Admin & Manager)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const cleaningRooms = await Room.countDocuments({ status: 'Cleaning' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Maintenance' });

    const totalGuests = await Guest.countDocuments();
    const activeReservations = await Reservation.countDocuments({
      status: { $in: ['Confirmed', 'Checked-In'] }
    });

    // Occupancy Rate calculation
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

    // Total Revenue calculation from Paid Bills
    const revenueAgg = await Bill.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        rooms: {
          total: totalRooms,
          available: availableRooms,
          occupied: occupiedRooms,
          cleaning: cleaningRooms,
          maintenance: maintenanceRooms,
          occupancyRate: `${occupancyRate}%`
        },
        guestsCount: totalGuests,
        activeReservations,
        totalRevenue: Math.round(totalRevenue)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};