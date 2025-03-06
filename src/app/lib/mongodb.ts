import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable in .env');
// }

// Gunakan cache global hanya dalam mode development
let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  (global as any).mongoose = cached; // Simpan ke global

  return cached.conn;
}

export default connectDB;
