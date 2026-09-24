const express = require('express');
const router = express.Router();
const {
  listCompetitions,
  getCompetition,
  registerForCompetition,
  submitEntry,
  getRegistrationStatus,
  getParticipation,
  getWinners,
  simulateBooking,
  resetSpots,
} = require('../controllers/competitionController');
const { getReviews, createReview } = require('../controllers/reviewController');
const { auth, optionalAuth } = require('../middleware/auth');

// Public – list all non-draft competitions
router.get('/', listCompetitions);

// Demo utility routes (for screen recording & concurrency showcases)
router.post('/:id/simulate-booking', simulateBooking);
router.post('/:id/reset-spots', resetSpots);

// Public endpoints
router.get('/:id', optionalAuth, getCompetition);
router.get('/:id/winners', getWinners);
router.get('/:id/reviews', getReviews);

// Authenticated endpoints
router.post('/:id/register', auth, registerForCompetition);
router.post('/:id/submit', auth, submitEntry);
router.post('/:id/submission', auth, submitEntry);
router.post('/:id/reviews', auth, createReview);
router.get('/:id/registration-status', auth, getRegistrationStatus);
router.get('/:id/participation', auth, getParticipation);

module.exports = router;

