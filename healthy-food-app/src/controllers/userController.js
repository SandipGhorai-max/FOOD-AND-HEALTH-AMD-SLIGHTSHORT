const googleServices = require('../services/googleServices');

// Simulate logging a meal and updating streak/points
const logMeal = async (req, res) => {
  try {
    const { userId, mealName, isHealthy } = req.body;
    
    if (!mealName) {
      return res.status(400).json({ error: 'Meal name is required.' });
    }

    // Fetch user profile
    const userProfile = await googleServices.getUserProfile(userId || 'default-user');
    
    // Behavioral tracking logic
    let pointsEarned = 0;
    let streakMessage = "Keep it up!";

    if (isHealthy) {
      pointsEarned = 50;
      userProfile.streak += 1;
      userProfile.points += pointsEarned;
      streakMessage = `Awesome! You earned ${pointsEarned} points. Your healthy eating streak is now ${userProfile.streak} days!`;
    } else {
      // Don't necessarily reset streak, but maybe offer a gentle nudge
      streakMessage = "It's okay to treat yourself! Let's aim for a healthy meal next.";
    }

    // In a real app, save updated profile back to DB here.

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
    console.error("User Controller Error:", error);
    return res.status(500).json({ error: 'Failed to log meal.' });
  }
};

module.exports = {
  logMeal
};
