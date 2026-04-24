/**
 * @fileoverview User controller handling behavioral tracking.
 */

const googleServices = require('../services/googleServices');

/**
 * Logs a meal and updates user streak/points.
 */
const logMeal = async (req, res, next) => {
  try {
    const { userId = 'default-user', mealName, isHealthy } = req.body;

    const userProfile = await googleServices.getUserProfile(userId);
    
    let pointsEarned = 0;
    let streakMessage = "Keep it up!";

    // Strictly enforce boolean checks
    if (isHealthy === true || isHealthy === 'true') {
      pointsEarned = 50;
      userProfile.streak = (userProfile.streak || 0) + 1;
      userProfile.points = (userProfile.points || 0) + pointsEarned;
      streakMessage = `Awesome! You earned ${pointsEarned} points. Your healthy eating streak is now ${userProfile.streak} days!`;
    } else {
      userProfile.streak = 0; // Reset streak on unhealthy choice
      streakMessage = "It's okay to treat yourself! Let's aim for a healthy meal next time to start a new streak.";
    }

    // In a real app, write back to DB here

    return res.status(200).json({
      message: 'Meal logged successfully.',
      loggedMeal: mealName,
      isHealthy,
      behavioralFeedback: {
        pointsEarned,
        newTotalPoints: userProfile.points,
        currentStreak: userProfile.streak,
        streakMessage
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  logMeal
};
