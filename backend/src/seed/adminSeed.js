import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD required for seeding');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin user already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await Admin.create({ email, password: hashedPassword });
  console.log('Admin seeded successfully');
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
