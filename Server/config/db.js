const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Server exit agar DB connect na ho
  }
};

// Disconnect listener (optional but good for production)
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected! Trying to reconnect...');
});

module.exports = connectDB;