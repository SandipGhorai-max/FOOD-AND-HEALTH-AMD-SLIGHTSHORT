const googleServices = require('../services/googleServices');

// Context-aware recommendation logic
const getRecommendations = async (req, res) => {
  try {
    const { userId, latitude, longitude, timeOfDay, weather } = req.body;

    // 1. Fetch user data and context concurrently
    const [userProfile, activity, nearbyFood] = await Promise.all([
      googleServices.getUserProfile(userId || 'default-user'),
      googleServices.getDailyActivity(userId || 'default-user'),
      googleServices.findNearbyHealthyFood(latitude || 37.7749, longitude || -122.4194)
    ]);

    // 2. Base Recommendation Engine Logic
    let mealSuggestions = [];
    
    // Adjust logic based on time
    if (timeOfDay === 'morning') {
      mealSuggestions.push({ name: 'Oatmeal with Berries', type: 'Breakfast', prepTime: '10 min', healthyScore: 95 });
      mealSuggestions.push({ name: 'Avocado Toast & Egg', type: 'Breakfast', prepTime: '15 min', healthyScore: 90 });
    } else if (timeOfDay === 'afternoon') {
      mealSuggestions.push({ name: 'Quinoa & Grilled Chicken Bowl', type: 'Lunch', prepTime: '20 min', healthyScore: 92 });
    } else {
      mealSuggestions.push({ name: 'Baked Salmon with Asparagus', type: 'Dinner', prepTime: '25 min', healthyScore: 98 });
    }

    // Adjust based on user preferences (e.g., Vegetarian)
    if (userProfile.preferences.includes('Vegetarian')) {
      mealSuggestions = mealSuggestions.filter(meal => !meal.name.includes('Chicken') && !meal.name.includes('Salmon'));
      mealSuggestions.push({ name: 'Lentil Curry with Brown Rice', type: 'Any', prepTime: '30 min', healthyScore: 94 });
    }

    // 3. Activity Context (Suggest high protein/carb recovery if active)
    let activityNudge = "Keep moving to hit your daily goal!";
    if (activity.steps > 8000) {
      activityNudge = "Great job today! Consider a high-protein meal for recovery.";
      mealSuggestions.push({ name: 'Protein Shake & Almonds', type: 'Snack', prepTime: '5 min', healthyScore: 85 });
    }

    // 4. Construct Final Payload
    const responseData = {
      context: {
        time: timeOfDay,
        weather: weather,
        activityNudge
      },
      user: {
        name: userProfile.name,
        streak: userProfile.streak,
        points: userProfile.points
      },
      mealSuggestions,
      nearbyOptions: nearbyFood
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Recommendation Error:", error);
    return res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
};

module.exports = {
  getRecommendations
};
