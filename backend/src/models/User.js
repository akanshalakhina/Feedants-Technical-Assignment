const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: String,
    /** Unique code used for referral links: feedants.com/r/<referralCode> */
    referralCode: { type: String, unique: true },
  },
  { timestamps: true }
);

// ─── Hooks ───────────────────────────────────────────────────────────────────

userSchema.pre('save', async function (next) {
  // Generate a unique referral code on first save
  if (!this.referralCode) {
    this.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  next();
});

// ─── Methods ─────────────────────────────────────────────────────────────────

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Strip sensitive fields from JSON output
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
