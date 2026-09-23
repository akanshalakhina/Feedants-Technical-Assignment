const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

// ─── GET /api/competitions ────────────────────────────────────────────────────
exports.listCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({ status: { $ne: 'draft' } })
      .select('title category prizePool entryFee totalSpots bookedSpots registrationCloseDate status')
      .lean({ virtuals: true });
    res.json({ competitions });
  } catch (err) {
    console.error('listCompetitions error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── GET /api/competitions/:id ────────────────────────────────────────────────
exports.getCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid competition ID' });
    }

    const competition = await Competition.findById(id).lean({ virtuals: true });
    if (!competition) return res.status(404).json({ message: 'Competition not found' });

    // If a user is logged in, tell them their registration status
    let isRegistered = false;
    let registration = null;
    if (req.user) {
      registration = await Registration.findOne({
        userId: req.user._id,
        competitionId: id,
      }).lean();
      isRegistered = !!registration;
    }

    res.json({ competition, isRegistered, registration });
  } catch (err) {
    console.error('getCompetition error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── POST /api/competitions/:id/register ─────────────────────────────────────
/**
 * Concurrency strategy (no replica set required):
 *
 * 1. Check if already registered (fast path to avoid unnecessary DB writes).
 * 2. Atomically claim a spot with findOneAndUpdate + condition
 *    `bookedSpots < totalSpots` — MongoDB's document-level write lock ensures
 *    only one writer wins per document at a time.
 * 3. Create the Registration document. If this fails with a duplicate key
 *    error (11000) it means a race led to two concurrent requests both passing
 *    step 1. We roll back the spot increment and return 409.
 *
 * This gives strong consistency without requiring a replica set / transactions.
 */
exports.registerForCompetition = async (req, res) => {
  try {
    const { id: competitionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: 'Invalid competition ID' });
    }

    // Fast-path duplicate check
    const existing = await Registration.findOne({ userId, competitionId });
    if (existing) {
      return res.status(409).json({ message: 'You are already registered for this competition' });
    }

    // Atomically claim a spot
    const competition = await Competition.findOneAndUpdate(
      {
        _id: competitionId,
        $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
        registrationCloseDate: { $gt: new Date() },
      },
      { $inc: { bookedSpots: 1 } },
      { new: true }
    ).lean({ virtuals: true });

    if (!competition) {
      // Determine the specific reason so the frontend can show the right message
      const comp = await Competition.findById(competitionId);
      if (!comp) return res.status(404).json({ message: 'Competition not found' });
      if (comp.bookedSpots >= comp.totalSpots)
        return res.status(409).json({ message: 'No spots remaining — the competition is fully booked' });
      return res.status(409).json({ message: 'Registration is closed for this competition' });
    }

    try {
      const registration = await Registration.create({ userId, competitionId, paymentStatus: 'paid' });
      res.status(201).json({ message: 'Registered successfully', competition, registration });
    } catch (err) {
      // Roll back spot decrement on any failure
      await Competition.findByIdAndUpdate(competitionId, { $inc: { bookedSpots: -1 } });
      if (err.code === 11000) {
        return res.status(409).json({ message: 'You are already registered for this competition' });
      }
      throw err;
    }
  } catch (err) {
    console.error('registerForCompetition error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── POST /api/competitions/:id/submit ───────────────────────────────────────
exports.submitEntry = async (req, res) => {
  try {
    const { id: competitionId } = req.params;
    const { submissionUrl } = req.body;
    const userId = req.user._id;

    if (!submissionUrl) {
      return res.status(400).json({ message: 'submissionUrl is required' });
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) return res.status(404).json({ message: 'Competition not found' });

    const now = new Date();
    if (now < competition.submissionStartDate) {
      return res.status(409).json({ message: 'Submission window has not opened yet' });
    }
    if (now > competition.submissionEndDate) {
      return res.status(409).json({ message: 'Submission window is closed' });
    }

    const registration = await Registration.findOneAndUpdate(
      { userId, competitionId },
      { submissionUrl, submittedAt: now },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ message: 'You are not registered for this competition' });
    }

    res.json({ message: 'Submission recorded successfully', registration });
  } catch (err) {
    console.error('submitEntry error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── GET /api/competitions/:id/registration-status ───────────────────────────
exports.getRegistrationStatus = async (req, res) => {
  try {
    const { id: competitionId } = req.params;
    const userId = req.user._id;

    const registration = await Registration.findOne({ userId, competitionId }).lean();
    res.json({ isRegistered: !!registration, registration });
  } catch (err) {
    console.error('getRegistrationStatus error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
