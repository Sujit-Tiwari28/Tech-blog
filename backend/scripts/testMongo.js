import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load backend .env
dotenv.config({ path: './.env' });

const uri = process.env.MONGO_URI;
console.log('Using MONGO_URI present:', !!uri);

(async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
