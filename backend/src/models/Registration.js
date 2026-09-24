const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['not_implemented', 'pending', 'paid', 'failed'],
      default: 'not_implemented', // Payment gateway integration is outside scope; explicitly tracked as not_implemented
    },
    submissionUrl: String,
    submittedAt: Date,
  },
  { timestamps: true }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

/**
 * Compound unique index: a user can only register once per competition.
 * This acts as the last line of defense against duplicate registrations
 * even under race conditions (the atomic spot-decrement query is the first guard).
 */
registrationSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
