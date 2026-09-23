const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── POST /api/auth/register ──────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
exports.me = async (req, res) => {
  res.json({ user: req.user });
};
