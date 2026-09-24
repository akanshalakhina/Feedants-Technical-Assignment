const mongoose = require('mongoose');
const Review = require('../models/Review');
const Competition = require('../models/Competition');

// ─── GET /api/competitions/:id/reviews ────────────────────────────────────────
exports.getReviews = async (req, res) => {
  try {
    const { id: competitionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: 'Invalid competition ID' });
    }

    const reviews = await Review.find({ competitionId })
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

    res.json({ reviews, totalReviews, averageRating });
  } catch (err) {
    console.error('getReviews error:', err);
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// ─── POST /api/competitions/:id/reviews ───────────────────────────────────────
exports.createReview = async (req, res) => {
  try {
    const { id: competitionId } = req.params;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: 'Invalid competition ID' });
    }

    // Validation: check competition exists
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    // Validation: rating
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    // Validation: comment
    if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Comment must be at least 3 characters long' });
    }

    // Validation: duplicate review
    const existing = await Review.findOne({ competitionId, userId });
    if (existing) {
      return res.status(409).json({ message: 'You have already submitted a review for this competition' });
    }

    const review = await Review.create({
      competitionId,
      userId,
      userName: req.user.name,
      userAvatar: req.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: Math.round(numRating),
      comment: comment.trim(),
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('createReview error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already submitted a review for this competition' });
    }
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};
