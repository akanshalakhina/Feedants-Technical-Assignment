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
      enum: ['pending', 'paid', 'failed'],
      default: 'paid', // mocked as paid for demo; real app would integrate Razorpay webhook
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
