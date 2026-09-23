const express = require('express');
const router = express.Router();
const {
  listCompetitions,
  getCompetition,
  registerForCompetition,
  submitEntry,
  getRegistrationStatus,
} = require('../controllers/competitionController');
const { auth, optionalAuth } = require('../middleware/auth');

// Public – list all non-draft competitions
router.get('/', listCompetitions);

// Public with optional auth – logged-in users also receive isRegistered flag
router.get('/:id', optionalAuth, getCompetition);

// Authenticated only
router.post('/:id/register', auth, registerForCompetition);
router.post('/:id/submit', auth, submitEntry);
router.get('/:id/registration-status', auth, getRegistrationStatus);

module.exports = router;
