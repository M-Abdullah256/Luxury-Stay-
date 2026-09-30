require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetAdminCredentials = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    // 👇 Yahan apna NAYA Email aur NAYA Password likhein:
    const NEW_EMAIL = 'admin@luxurystay.com'; // Jo email aap rakhna chahte hain
    const NEW_PASSWORD = '123456';      // Jo password aap rakhna chahte hain

    // Super Admin find karein
    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('Admin account nahi mila!');
      process.exit(1);
    }

    // Naye credentials set karein
    admin.email = NEW_EMAIL;
    admin.password = NEW_PASSWORD; // Model ka pre('save') hook isay khud hi hash/encrypt kar dega!
    
    await admin.save();

    console.log('====================================');
    console.log('✅ Admin Credentials Updated Successfully!');
    console.log(`📧 Naya Email:    ${NEW_EMAIL}`);
    console.log(`🔑 Naya Password: ${NEW_PASSWORD}`);
    console.log('====================================');

    process.exit();
  } catch (error) {
    console.error('❌ Error updating admin:', error.message);
    process.exit(1);
  }
};

resetAdminCredentials();