const request = require('supertest');
const app = require('../src/server');

describe('User Behavioral Tracking API', () => {
  it('should increase streak and points for a healthy meal', async () => {
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'test_user',
        mealName: 'Quinoa Salad',
        isHealthy: true
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.behavioralFeedback.pointsEarned).toBe(50);
    expect(res.body.behavioralFeedback.streakMessage).toContain('Awesome');
  });

  it('should not increase streak for an unhealthy meal', async () => {
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'test_user',
        mealName: 'Double Cheeseburger',
        isHealthy: false
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.behavioralFeedback.pointsEarned).toBe(0);
    expect(res.body.behavioralFeedback.streakMessage).toContain('treat yourself');
  });

  it('should return 400 if meal name is missing', async () => {
    const res = await request(app)
      .post('/api/log-meal')
      .send({
        userId: 'test_user',
        isHealthy: true
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });
});
