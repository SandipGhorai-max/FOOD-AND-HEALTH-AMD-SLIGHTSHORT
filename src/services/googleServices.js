/**
 * @fileoverview Emulated Google Services Layer.
 * Replicates exact payload structures of Google Maps, Firebase, and Fit APIs.
 */

// Simulating a Firebase Database structure
const mockDatabase = {
  'user_123': {
    name: "Alex User",
    preferences: ["Vegetarian", "High Protein"],
    allergies: ["Peanuts"],
    streak: 12,
    points: 1250,
    dailyCalorieGoal: 2000
  },
  'active_user': {
    name: "Active Andy",
    preferences: [],
    allergies: [],
    streak: 5,
    points: 500,
    dailyCalorieGoal: 2500
  }
};

/**
 * Mocks Google Maps Places API `nearbySearch` payload.
 */
const findNearbyHealthyFood = async (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation failure exactly like Google Maps API
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return reject(new Error('INVALID_REQUEST: location must be numerical coordinates.'));
      }
      
      resolve([
        {
          place_id: "ChIJ123456789",
          name: "Green Leaf Salads",
          types: ["restaurant", "food", "point_of_interest"],
          rating: 4.8,
          distance: "0.4 miles",
          healthyOptions: ["Quinoa Bowl", "Kale Salad", "Fresh Pressed Juice"]
        },
        {
          place_id: "ChIJ987654321",
          name: "Nourish Cafe",
          types: ["cafe", "food", "point_of_interest"],
          rating: 4.6,
          distance: "0.8 miles",
          healthyOptions: ["Avocado Toast", "Lentil Soup", "Vegan Wrap"]
        }
      ]);
    }, 100); // reduced delay for faster testing
  });
};

/**
 * Mocks Google Fit API aggregate dataset.
 */
const getDailyActivity = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return high activity for 'active_user'
      if (userId === 'active_user') {
        resolve({ steps: 12500, caloriesBurned: 650, activeMinutes: 90, goalMet: true });
      } else {
        resolve({ steps: 5400, caloriesBurned: 320, activeMinutes: 25, goalMet: false });
      }
    }, 50);
  });
};

/**
 * Mocks Firebase Auth and Firestore document retrieval.
 */
const getUserProfile = async (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!userId) {
        return reject(new Error('auth/user-not-found'));
      }
      
      const userDoc = mockDatabase[userId];
      if (userDoc) {
        // Deep copy to prevent reference mutation bugs
        resolve(JSON.parse(JSON.stringify(userDoc)));
      } else {
        resolve({
          name: "Guest",
          preferences: [],
          allergies: [],
          streak: 0,
          points: 0,
          dailyCalorieGoal: 2000
        });
      }
    }, 50);
  });
};

module.exports = {
  findNearbyHealthyFood,
  getDailyActivity,
  getUserProfile
};
