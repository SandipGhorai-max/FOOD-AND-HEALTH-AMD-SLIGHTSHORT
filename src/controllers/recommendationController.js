/**
 * @fileoverview Recommendation controller.
 * Handles context-aware meal suggestions using LRU Cache for efficiency.
 */

const { LRUCache } = require('lru-cache');
const googleServices = require('../services/googleServices');

// Efficiency: Initialize LRU Cache (cache identical requests for 5 minutes)
const recCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5,
});

/**
 * Generates personalized food recommendations based on user context.
 */
const getRecommendations = async (req, res, next) => {
  try {
    const { userId = 'default-user', latitude = 37.7749, longitude = -122.4194, timeOfDay = 'morning', weather = 'Clear' } = req.body;

    // Cache key based on context hash
    const cacheKey = `${userId}-${latitude}-${longitude}-${timeOfDay}`;
    if (recCache.has(cacheKey)) {
      return res.status(200).json(recCache.get(cacheKey));
    }

    // Reliability: Use Promise.allSettled to avoid failing everything if one external API fails
    const results = await Promise.allSettled([
      googleServices.getUserProfile(userId),
      googleServices.getDailyActivity(userId),
      googleServices.findNearbyHealthyFood(latitude, longitude)
    ]);

    // Handle potential microservice failures gracefully
    const userProfile = results[0].status === 'fulfilled' ? results[0].value : { name: "Guest", preferences: [], streak: 0, points: 0 };
    const activity = results[1].status === 'fulfilled' ? results[1].value : { steps: 0 };
    const nearbyFood = results[2].status === 'fulfilled' ? results[2].value : [];

    let mealSuggestions = [];
    
    // Core logic
    if (timeOfDay === 'morning') {
      mealSuggestions.push({ name: 'Oatmeal with Berries', type: 'Breakfast', prepTime: '10 min', healthyScore: 95 });
      mealSuggestions.push({ name: 'Avocado Toast & Egg', type: 'Breakfast', prepTime: '15 min', healthyScore: 90 });
    } else if (timeOfDay === 'afternoon') {
      mealSuggestions.push({ name: 'Quinoa & Grilled Chicken Bowl', type: 'Lunch', prepTime: '20 min', healthyScore: 92 });
    } else {
      mealSuggestions.push({ name: 'Baked Salmon with Asparagus', type: 'Dinner', prepTime: '25 min', healthyScore: 98 });
    }

    // Filter by allergies/preferences
    if (userProfile.preferences.includes('Vegetarian')) {
      mealSuggestions = mealSuggestions.filter(meal => !meal.name.includes('Chicken') && !meal.name.includes('Salmon'));
      mealSuggestions.push({ name: 'Lentil Curry with Brown Rice', type: 'Lunch/Dinner', prepTime: '30 min', healthyScore: 94 });
    }

    // Activity Context Nudge
    let activityNudge = "Keep moving to hit your daily goal!";
    if (activity.steps > 8000) {
      activityNudge = "Great job today! Consider a high-protein meal for recovery.";
      mealSuggestions.push({ name: 'Protein Shake & Almonds', type: 'Snack', prepTime: '5 min', healthyScore: 85 });
    }

    const responseData = {
      context: { time: timeOfDay, weather, activityNudge },
      user: { name: userProfile.name, streak: userProfile.streak, points: userProfile.points },
      mealSuggestions,
      nearbyOptions: nearbyFood
    };

    // Store in Cache
    recCache.set(cacheKey, responseData);

    return res.status(200).json(responseData);

  } catch (error) {
    next(error); // Pass to global error handler
  }
};

module.exports = {
  getRecommendations,
  // Export cache for testing resets
  recCache
};
