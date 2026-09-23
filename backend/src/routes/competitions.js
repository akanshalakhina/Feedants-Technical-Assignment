const express = require('express');
const router = express.Router();
const {
  listCompetitions,
  getCompetition,
  registerForCompetition,
  submitEntry,
  getRegistrationStatus,
  simulateBooking,
  resetSpots,
} = require('../controllers/competitionController');
const { auth, optionalAuth } = require('../middleware/auth');

// Public – list all non-draft competitions
router.get('/', listCompetitions);

// Demo utility routes (for screen recording & concurrency showcases)
router.post('/:id/simulate-booking', simulateBooking);
router.post('/:id/reset-spots', resetSpots);

// Public with optional auth – logged-in users also receive isRegistered flag
router.get('/:id', optionalAuth, getCompetition);

// Authenticated only
router.post('/:id/register', auth, registerForCompetition);
router.post('/:id/submit', auth, submitEntry);
router.get('/:id/registration-status', auth, getRegistrationStatus);

module.exports = router;

