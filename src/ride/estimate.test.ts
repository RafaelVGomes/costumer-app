import request from 'supertest';
import app from '../index'; // Ajuste o caminho conforme o app principal

describe('POST /ride/estimate', () => {
  it('should return a valid ride estimate', async () => {
    const response = await request(app).post('/ride/estimate').send({
      origin: 'Point A',
      destination: 'Point B',
      distance: 10, // in km
      time: 15, // in minutes
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('estimate');
    expect(response.body.estimate).toBeGreaterThan(0);
  });
});
