const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  position: { type: Number, required: true },
  label: { type: String, required: true }, // "1st Winner", "2nd Winner", …
  amount: { type: Number, required: true },
  icon: { type: String, enum: ['gold', 'silver', 'bronze', 'star'], default: 'star' },
});

const previousWinnerSchema = new mongoose.Schema({
  name: String,
  rank: { type: String, enum: ['1st', '2nd', '3rd'] },
  videoThumbnailUrl: String,
  videoUrl: String,
});

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
    prizePool: { type: Number, required: true },
    entryFee: { type: Number, required: true },
    totalSpots: { type: Number, required: true },
    bookedSpots: { type: Number, default: 0 },

    judge: {
      name: String,
      title: String,
      experience: String,
      photoUrl: String,
      introVideoUrl: String,
    },

    // Lifecycle dates
    registrationCloseDate: { type: Date, required: true },
    submissionStartDate: { type: Date, required: true },
    submissionEndDate: { type: Date, required: true },
    resultDate: { type: Date, required: true },

    // Bilingual content
    description: { en: String, hi: String },
    judgingParameters: { en: String, hi: String },
    rulesAndEligibility: { en: String, hi: String },

    rewards: [rewardSchema],
    previousWinners: [previousWinnerSchema],

    status: {
      type: String,
      enum: ['draft', 'upcoming', 'registration_open', 'submission_open', 'judging', 'completed'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

// ─── Virtuals ────────────────────────────────────────────────────────────────

/** How many spots are still open */
competitionSchema.virtual('spotsRemaining').get(function () {
  return Math.max(0, this.totalSpots - this.bookedSpots);
});

/**
 * Status computed purely from current date + lifecycle dates.
 * This is what the frontend should use for UI logic.
 */
competitionSchema.virtual('computedStatus').get(function () {
  const now = new Date();
  if (now <= this.registrationCloseDate) return 'registration_open';
  if (now >= this.submissionStartDate && now <= this.submissionEndDate) return 'submission_open';
  if (now > this.submissionEndDate && now < this.resultDate) return 'judging';
  if (now >= this.resultDate) return 'completed';
  return 'registration_closed'; // gap between reg close and submission start
});

competitionSchema.set('toJSON', { virtuals: true });
competitionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Competition', competitionSchema);
