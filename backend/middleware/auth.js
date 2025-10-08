const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  // roles can be a single role string or an array
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.id).select('-passwordHash');
      if (!req.user) return res.status(401).json({ message: 'User not found' });

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;
