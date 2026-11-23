const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/volunteer_availability';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(` MongoDB Connection Warning: ${error.message}`);
    console.log(` Please ensure MongoDB is running on port 27017 or provide MONGO_URI in backend/.env`);
    return false;
  }
};

module.exports = connectDB;
