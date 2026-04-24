/**
 * Mock Google Services Layer
 * In a real-world scenario, these would connect to actual Google APIs (Maps, Firebase, Fit)
 * using their respective SDKs and API keys.
 */

// Google Maps API Mock - Find nearby healthy food
const findNearbyHealthyFood = async (latitude, longitude) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!latitude || !longitude) {
    throw new Error('Location is required to find nearby food.');
  }

  // Return mock locations
  return [
    {
      id: 1,
      name: "Green Leaf Salads",
      type: "Salad Bar",
      rating: 4.8,
      distance: "0.4 miles",
      healthyOptions: ["Quinoa Bowl", "Kale Salad", "Fresh Pressed Juice"]
    },
    {
      id: 2,
      name: "Nourish Cafe",
      type: "Healthy Eatery",
      rating: 4.6,
      distance: "0.8 miles",
      healthyOptions: ["Avocado Toast", "Lentil Soup", "Vegan Wrap"]
    }
  ];
};

// Google Fit API Mock - Get daily activity
const getDailyActivity = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Return mock fitness data
  return {
    steps: 8400,
    caloriesBurned: 420,
    activeMinutes: 45,
    goalMet: false
  };
};

// Firebase Auth & DB Mock - Get user profile
const getUserProfile = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock Firebase Document
  return {
    userId,
    name: "Alex User",
    preferences: ["Vegetarian", "High Protein"],
    allergies: ["Peanuts"],
    streak: 12, // Number of consecutive days eating healthy
    points: 1250, // Reward points for healthy choices
    dailyCalorieGoal: 2000
  };
};

module.exports = {
  findNearbyHealthyFood,
  getDailyActivity,
  getUserProfile
};
