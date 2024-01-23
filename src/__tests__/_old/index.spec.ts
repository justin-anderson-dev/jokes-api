import { server, app } from '../../index';
import request from 'supertest';

describe('Express app', () => {
  afterAll((done) => {
    server.close(done); // Close the server after the tests
  });

  it('should respond with a welcome message', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'My API Server' });
  });

  it('should respond with a 404 for non-existent routes', async () => {
    const response = await request(server).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});

describe('Middleware', () => {
  it('should parse json correctly with body-parser', async () => {
    const testData = { test: 'test data' };

    // Create a temporary test route
    app.post('/test', (req, res) => {
      // Respond with the parsed data
      res.status(200).json(req.body);
    });

    const response = await request(app).post('/test').send(testData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testData);
  });
});
