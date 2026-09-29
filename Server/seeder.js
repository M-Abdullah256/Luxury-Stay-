require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');

const sampleRooms = [
  {
    roomNumber: '101',
    roomType: 'Standard',
    pricePerNight: 120,
    floor: 1,
    capacity: { adults: 2, children: 1 },
    status: 'Available',
    amenities: ['High-speed WiFi', 'Air Conditioning', 'Flat-screen TV', 'Coffee Maker'],
    description: 'Comfortable standard room with modern amenities, ideal for short stays.'
  },
  {
    roomNumber: '102',
    roomType: 'Deluxe',
    pricePerNight: 200,
    floor: 1,
    capacity: { adults: 2, children: 1 },
    status: 'Available',
    amenities: ['High-speed WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'City View Balcony'],
    description: 'Spacious deluxe room with private balcony overlooking the city skyline.'
  },
  {
    roomNumber: '201',
    roomType: 'Suite',
    pricePerNight: 350,
    floor: 2,
    capacity: { adults: 3, children: 2 },
    status: 'Available',
    amenities: ['High-speed WiFi', 'Jacuzzi', 'King Bed', 'Living Area', 'Mini Bar', 'Complimentary Breakfast'],
    description: 'Luxury suite featuring a dedicated master bedroom and separate lounge area.'
  },
  {
    roomNumber: '202',
    roomType: 'Executive Suite',
    pricePerNight: 500,
    floor: 2,
    capacity: { adults: 4, children: 2 },
    status: 'Cleaning',
    amenities: ['Private Lounge', 'Workstation', 'High-speed WiFi', 'Jacuzzi', 'Express Check-in'],
    description: 'Designed for business executives seeking utmost comfort and convenience.'
  },
  {
    roomNumber: '301',
    roomType: 'Presidential Suite',
    pricePerNight: 950,
    floor: 3,
    capacity: { adults: 4, children: 3 },
    status: 'Maintenance',
    amenities: ['Panoramic View', 'Private Butler Service', 'Infinity Tub', 'Dining Area', 'Kitchenette'],
    description: 'The pinnacle of luxury at LuxuryStay with 360-degree panoramic views.'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // 1. Seed Admin
    const existingAdmin = await User.findOne({ email: 'admin@luxurystay.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@luxurystay.com',
        password: 'admin123456',
        role: 'admin',
        phone: '+923001234567'
      });
      console.log('✅ Super Admin created.');
    } else {
      console.log('ℹ️  Super Admin already exists.');
    }

    // 2. Seed Rooms
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      await Room.insertMany(sampleRooms);
      console.log(`✅ ${sampleRooms.length} Sample Rooms inserted successfully!`);
    } else {
      console.log(`ℹ️  Rooms already exist (${roomCount} rooms in DB).`);
    }

    console.log('🎉 Seeding completed!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedData();