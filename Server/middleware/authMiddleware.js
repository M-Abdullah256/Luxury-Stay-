const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Check karega ke user logged in hai aur token valid hai ya nahi
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Token verify karein
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret123'
      );

      // User fetch karein (password ke baghair)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account has been deactivated. Contact Admin.'
        });
      }

      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

// 2. Roles restrict karne ke liye (e.g. authorize('admin', 'manager'))
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role [${req.user.role}] is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };