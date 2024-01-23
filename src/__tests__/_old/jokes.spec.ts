import { server } from '../../index';
import request from 'supertest';
import { prisma } from '../../index'; // Import your Prisma client

jest.spyOn(prisma.joke, 'findMany').mockResolvedValue([
  // Mocked response
  { id: 1, content: 'Test joke 1' },
  { id: 2, content: 'Test joke 2' }
]);

jest.spyOn(prisma.joke, 'findUnique').mockResolvedValue({
  id: 1,
  content: 'Test joke 1'
});

describe('Jokes routes', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('should call prisma.joke.findMany and return all jokes', async () => {
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

  it('should call prisma.joke.findUnique and return the joke with the specified id', async () => {
    const id = 1;
    const response = await request(server).get(`/api/v1/jokes/${id}`);

    expect(prisma.joke.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      joke: { id: 1, content: 'Test joke 1' }
    });
  });

  it('should call prisma.joke.create and return the created joke', async () => {
    const jokeContent = 'Test joke 1';
    const mockJoke = { id: 1, content: jokeContent };

    jest.spyOn(prisma.joke, 'create').mockResolvedValue(mockJoke);

    const response = await request(server)
      .post(`/api/v1/jokes/`)
      .send({ content: jokeContent });

    expect(prisma.joke.create).toHaveBeenCalledWith({
      data: { content: jokeContent }
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Joke created successfully',
      joke: mockJoke
    });
  });
});
