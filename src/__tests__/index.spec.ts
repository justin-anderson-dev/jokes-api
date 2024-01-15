import { server } from '../index';
import request from 'supertest';

describe('Express app', () => {
  afterAll((done) => {
    server.close(done); // Close the server after the tests
  });

  it('should respond with a 404 for non-existent routes', async () => {
    const response = await request(server).get('/non-existent-route');
    expect(response.status).toBe(404);
  });

  //TODO: Write actual tests fort the server
});
