import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('🔐 Auth middleware check:', {
    hasAuthHeader: !!authHeader,
    headerValue: authHeader ? authHeader.substring(0, 20) + '...' : null,
  });

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ Authentication failed: Missing or invalid token format');
    return res.status(401).json({ message: 'Authentication token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for admin ID:', decoded.id);

    // Find admin
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      console.warn('⚠️ Admin account not found for ID:', decoded.id);
      return res.status(401).json({ message: 'Admin account not found' });
    }

    console.log('✅ Admin authenticated:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(401).json({ message: 'Token verification failed' });
  }
};
