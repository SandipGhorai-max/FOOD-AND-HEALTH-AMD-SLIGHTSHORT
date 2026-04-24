/**
 * @fileoverview API Routing and input validation middleware.
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const recommendationController = require('../controllers/recommendationController');
const userController = require('../controllers/userController');

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ==========================================
// API Endpoints
// ==========================================

router.post('/recommendations', [
  body('userId').optional().isString().trim(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('timeOfDay').optional().isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid time of day'),
  body('weather').optional().isString().trim().escape(),
  validate
], recommendationController.getRecommendations);

router.post('/log-meal', [
  body('userId').optional().isString().trim(),
  body('mealName').notEmpty().withMessage('Meal name is required').isString().trim().escape(),
  body('isHealthy').isBoolean().withMessage('isHealthy must be a boolean'),
  validate
], userController.logMeal);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running smoothly' });
});

module.exports = router;
