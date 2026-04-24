const request = require('supertest');
const app = require('../src/server');
const { recCache } = require('../src/controllers/recommendationController');

describe('Recommendation API Edge Cases', () => {
  beforeEach(() => {
    recCache.clear(); // Clear LRU cache before each test
  });

  it('should return context-aware recommendations based on morning time', async () => {
    const res = await request(app)
      .post('/api/recommendations')
      .send({
        userId: 'user_123',
        latitude: 37.77,
        longitude: -122.41,
        timeOfDay: 'morning',
        weather: 'Sunny'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('context');
    expect(res.body.context.time).toBe('morning');
    expect(res.body.mealSuggestions[0].type).toBe('Breakfast');
    expect(res.body.user.name).toBe('Alex User');
  });

  it('should adapt to high activity levels by providing protein recommendations', async () => {
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

  it('should handle missing payload parameters gracefully (defaults to Guest/Morning/SF)', async () => {
    const res = await request(app).post('/api/recommendations').send({});
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.name).toBe('Guest');
  });

  it('should return 400 for completely invalid latitude', async () => {
    const res = await request(app)
      .post('/api/recommendations')
      .send({ latitude: 999 }); // Invalid lat > 90
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe('Valid latitude is required');
  });

  it('should utilize cache on subsequent identical requests', async () => {
    const payload = { userId: 'user_123', timeOfDay: 'evening' };
    
    // First request computes
    const res1 = await request(app).post('/api/recommendations').send(payload);
    expect(res1.statusCode).toEqual(200);

    // Second request should hit cache
    const res2 = await request(app).post('/api/recommendations').send(payload);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toEqual(res1.body);
  });
});
