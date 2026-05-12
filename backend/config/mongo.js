const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI not found. Skipping MongoDB connection for POC.');
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { connectMongo };
