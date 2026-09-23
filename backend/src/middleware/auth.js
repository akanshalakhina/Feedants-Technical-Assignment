const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Strict auth – rejects the request if no valid token is provided.
 * Use on routes that require authentication (register for competition, submit entry, etc.)
 */
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Optional auth – attaches `req.user` if a valid token is present,
 * but lets unauthenticated requests pass through.
 * Use on public routes that have richer responses for logged-in users
 * (e.g. GET /competitions/:id includes `isRegistered` when authed).
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user) req.user = user;
  } catch {
    // Ignore invalid tokens on optional routes
  }
  next();
};

module.exports = { auth, optionalAuth };
