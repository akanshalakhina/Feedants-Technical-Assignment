require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const competitionRoutes = require('./routes/competitions');

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// General limiter: 200 req / 15 min per IP
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

// Tighter limiter on registration endpoint to prevent spot hoarding
app.use(
  '/api/competitions/:id/register',
  rateLimit({ windowMs: 60 * 1000, max: 5, message: { message: 'Too many registration attempts, please slow down' } })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/competitions', competitionRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Database + Server ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedants';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB:', MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app; // for testing
