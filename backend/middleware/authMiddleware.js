import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = (req, res, next) => {
  let token = req.header('x-auth-token');
  const authHeader = req.header('Authorization') || req.header('authorization');

  if (!token && authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ msg: 'No token, authorization denied', message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded.user || decoded;
    if (req.user) {
      if (!req.user._id && req.user.id) req.user._id = req.user.id;
      if (!req.user.id && req.user._id) req.user.id = req.user._id;
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid', message: 'Invalid or expired token. Please log in again.' });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found', message: 'User not found' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.', message: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ msg: 'Server error in admin authorization', message: 'Server error' });
  }
};
