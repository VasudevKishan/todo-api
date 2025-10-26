import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.DATABASE_URI;
    if (!uri) throw new Error('DATABASE_URI environment variable is not set');
    await mongoose.connect(uri);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
