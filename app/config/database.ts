import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  // Prevent unnecessary connection attempts
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  // Check if MongoDB URI is defined
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;
    console.log(`MongoDB connected: ${connection.connection.host}`);

    // Setup disconnect handler to update state
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw new Error('Failed to connect to database');
  }
};

export default connectDB;
