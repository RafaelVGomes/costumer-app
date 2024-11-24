import request from 'supertest';
import app from '../index'; // Certifique-se de que está importando o servidor corretamente

describe('POST /ride/estimate', () => {
  it('should return a valid ride estimate', async () => {
    const response = await request(app).post('/ride/estimate').send({
      distance: 10, // km
      time: 15, // minutos
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('estimate');
    expect(response.body.estimate).toBeGreaterThan(0);
  });
});
