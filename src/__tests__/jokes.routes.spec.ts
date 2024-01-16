import { server } from '../index';
import request from 'supertest';
import { prisma } from '../index'; // Import your Prisma client

jest.spyOn(prisma.joke, 'findMany').mockResolvedValue([
  // Mocked response
  { id: 1, content: 'Test joke 1' },
  { id: 2, content: 'Test joke 2' }
]);

describe('Jokes route', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('should call prisma.joke.findMany and return jokes', async () => {
    const response = await request(server).get('/api/v1/jokes'); // Replace '/jokes' with your actual jokes route

    expect(prisma.joke.findMany).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      jokes: [
        { id: 1, content: 'Test joke 1' },
        { id: 2, content: 'Test joke 2' }
      ]
    });
  });
});
