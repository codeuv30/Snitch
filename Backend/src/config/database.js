import mongoose from 'mongoose';
import config from "./config.js";

const MONGO_URI = config.MONGO_URI;

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

export default connectDB;
