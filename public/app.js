document.addEventListener('DOMContentLoaded', () => {
  // Mock User ID for demonstration
  const userId = 'user_123';
  
  // DOM Elements
  const contextBanner = document.getElementById('context-banner');
  const recommendationList = document.getElementById('recommendation-list');
  const nearbyList = document.getElementById('nearby-list');
  const userPoints = document.getElementById('user-points');
  const userStreak = document.getElementById('user-streak');
  const logMealForm = document.getElementById('log-meal-form');
  const feedbackMessage = document.getElementById('feedback-message');

  // Initialize App
  const initApp = async () => {
    // Determine context
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 11 && hour < 16) timeOfDay = 'afternoon';
    else if (hour >= 16) timeOfDay = 'evening';

    // Mock Location (San Francisco)
    const contextPayload = {
      userId,
      latitude: 37.7749,
      longitude: -122.4194,
      timeOfDay,
      weather: 'Sunny'
    };

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextPayload)
      });
      const data = await response.json();
      
      renderDashboard(data);
    } catch (err) {
      contextBanner.innerHTML = `<p>Error loading context. Please try again later.</p>`;
      console.error(err);
    }
  };

  const renderDashboard = (data) => {
    // 1. Update Context Banner
    contextBanner.innerHTML = `
      <p>Good ${data.context.time}! It's ${data.context.weather} outside.</p>
      <p style="font-size: 0.9rem; font-weight: normal; margin-top: 0.5rem;">${data.context.activityNudge}</p>
    `;

    // 2. Update Stats
    userPoints.textContent = `🪙 ${data.user.points}`;
    userStreak.textContent = `🔥 ${data.user.streak} Days`;

    // 3. Render Recommendations
    recommendationList.innerHTML = data.mealSuggestions.map(meal => `
      <div class="card" tabindex="0">
        <h3>${meal.name}</h3>
        <p>Type: ${meal.type} • Prep: ${meal.prepTime}</p>
        <span class="badge">Health Score: ${meal.healthyScore}</span>
      </div>
    `).join('');

    // 4. Render Nearby
    nearbyList.innerHTML = data.nearbyOptions.map(place => `
      <div class="card" tabindex="0">
        <h3>${place.name}</h3>
        <p>${place.type} • ⭐ ${place.rating} • 📍 ${place.distance}</p>
        <p><strong>Try:</strong> ${place.healthyOptions.join(', ')}</p>
      </div>
    `).join('');
  };

  // Handle Form Submission
  logMealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mealName = document.getElementById('meal-name').value;
    const isHealthy = document.getElementById('is-healthy').checked;

    try {
      const response = await fetch('/api/log-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mealName, isHealthy })
      });
      const data = await response.json();

      // Show Feedback
      feedbackMessage.textContent = data.behavioralFeedback.streakMessage;
      feedbackMessage.classList.remove('hidden');

      // Update Header Stats
      userPoints.textContent = `🪙 ${data.behavioralFeedback.newTotalPoints}`;
      userStreak.textContent = `🔥 ${data.behavioralFeedback.currentStreak} Days`;

      // Reset form
      logMealForm.reset();
      
      // Hide feedback after 5 seconds
      setTimeout(() => {
        feedbackMessage.classList.add('hidden');
      }, 5000);

    } catch (err) {
      console.error("Failed to log meal", err);
    }
  });

  initApp();
});
