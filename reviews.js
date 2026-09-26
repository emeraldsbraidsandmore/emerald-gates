const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, '../data/reviews.json');

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await fs.readJson(REVIEWS_FILE);
    res.json({ success: true, reviews });
  } catch (err) {
    res.json({ success: true, reviews: [] });
  }
});

// POST new review
router.post('/', async (req, res) => {
  try {
    const { name, rating, service, review } = req.body;

    if (!name || !rating || !review) {
      return res.status(400).json({ success: false, message: 'Name, rating and review are required.' });
    }

    let reviews = [];
    try {
      reviews = await fs.readJson(REVIEWS_FILE);
    } catch (e) {
      reviews = [];
    }

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      rating: parseInt(rating),
      service: service ? service.trim() : 'Emerald Gates Client',
      review: review.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      timestamp: new Date().toISOString()
    };

    reviews.unshift(newReview);
    await fs.writeJson(REVIEWS_FILE, reviews, { spaces: 2 });

    res.json({ success: true, review: newReview });
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    let reviews = await fs.readJson(REVIEWS_FILE);
    reviews = reviews.filter(r => r.id !== parseInt(req.params.id));
    await fs.writeJson(REVIEWS_FILE, reviews, { spaces: 2 });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
