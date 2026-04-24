const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const userController = require('../controllers/userController');

// Define API routes
router.post('/recommendations', recommendationController.getRecommendations);
router.post('/log-meal', userController.logMeal);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running smoothly' });
});

module.exports = router;
