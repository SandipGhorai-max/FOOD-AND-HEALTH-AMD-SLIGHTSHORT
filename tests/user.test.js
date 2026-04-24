const request = require('supertest');
const app = require('../src/server');

describe('User Behavioral Tracking API Edge Cases', () => {
  it('should increase streak and points for a healthy meal', async () => {
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'user_123',
        mealName: 'Quinoa Salad',
        isHealthy: true
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.behavioralFeedback.pointsEarned).toBe(50);
    expect(res.body.behavioralFeedback.streakMessage).toContain('Awesome');
    expect(res.body.behavioralFeedback.currentStreak).toBe(13); // previous was 12
  });

  it('should reset streak for an unhealthy meal', async () => {
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'active_user',
        mealName: 'Double Cheeseburger',
        isHealthy: false
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.behavioralFeedback.pointsEarned).toBe(0);
    expect(res.body.behavioralFeedback.currentStreak).toBe(0); // reset
    expect(res.body.behavioralFeedback.streakMessage).toContain('treat yourself');
  });

  it('should return 400 if meal name is missing', async () => {
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'user_123',
        isHealthy: true
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe('Meal name is required');
  });

  it('should return 400 if isHealthy is not a boolean', async () => {
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'user_123',
        mealName: 'Apple',
        isHealthy: 'yes' // Invalid type
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe('isHealthy must be a boolean');
  });

  it('should sanitize XSS from meal name', async () => {
    // xss-clean middleware will escape or strip script tags
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'user_123',
        mealName: '<script>alert(1)</script>Apple',
        isHealthy: true
      });

    expect(res.statusCode).toEqual(200);
    // The express-validator `.escape()` turns < into &lt;
    expect(res.body.loggedMeal).not.toContain('<script>');
  });
});
