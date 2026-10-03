import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const login = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Login failed: database not connected');
      return res.status(503).json({ message: 'Database unavailable. Please check your MongoDB connection.' });
    }

    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Validate inputs
    if (!email || !password) {
      console.warn('⚠️ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.warn('⚠️ Admin not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      console.warn('⚠️ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(admin._id);
    console.log('✅ Login successful for:', email);

    // Return response with proper structure
    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
