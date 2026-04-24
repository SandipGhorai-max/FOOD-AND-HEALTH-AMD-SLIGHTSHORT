const request = require('supertest');
const app = require('../src/server');

describe('Recommendation API', () => {
  it('should return context-aware recommendations based on morning time', async () => {
    const res = await request(app)
      .post('/api/recommendations')
      .send({
        userId: 'test_user',
        latitude: 37.77,
        longitude: -122.41,
        timeOfDay: 'morning',
        weather: 'Sunny'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('context');
    expect(res.body.context.time).toBe('morning');
    expect(res.body).toHaveProperty('mealSuggestions');
    expect(res.body.mealSuggestions.length).toBeGreaterThan(0);
    expect(res.body.mealSuggestions[0].type).toBe('Breakfast');
    expect(res.body).toHaveProperty('nearbyOptions');
  });

  it('should adapt to high activity levels by providing protein recommendations', async () => {
    // Note: Since we are using a mock service that returns 8400 steps,
    // the activity nudge should trigger the protein shake addition.
    const res = await request(app)
      .post('/api/recommendations')
      .send({
        userId: 'active_user',
        timeOfDay: 'afternoon'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.context.activityNudge).toContain('high-protein');
    const snack = res.body.mealSuggestions.find(m => m.type === 'Snack');
    expect(snack).toBeDefined();
    expect(snack.name).toContain('Protein');
  });
});
