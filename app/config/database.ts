import mongoose from 'mongoose';

let connected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  //   if the database is already connected, dont connect again

  if (connected) {
    console.log('MongoDB already connected');
    return;
  }

  //   connect to the MongoDB database
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    connected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

export default connectDB;
