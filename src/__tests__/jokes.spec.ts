import request from 'supertest';
import express from 'express';
import {
  handleNewJoke,
  handleGetAJoke,
  handleGetAllJokes
} from '../controllers/jokesController';
import { prisma } from '../index';

// Mock the Prisma client
jest.mock('../index', () => ({
  prisma: {
    joke: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

// Test requests made to /jokes endpoints using Supertest
const app = express();
app.use(express.json());
app.post('/jokes', handleNewJoke);
app.get('/jokes', handleGetAllJokes);
app.get('/jokes/:id', handleGetAJoke);

describe('handleGetAllJokes', () => {
  it('responds with 200 and all jokes', async () => {
    const jokes = [
      { id: 1, content: 'Test joke 1' },
      { id: 2, content: 'Test joke 2' }
    ];
    (prisma.joke.findMany as jest.Mock).mockResolvedValue(jokes);

    const res = await request(app).get('/jokes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ jokes });
  });
});

describe('handleGetAJoke', () => {
  it('responds with 200 and the joke if the joke is found', async () => {
    const joke = { id: 1, content: 'Test joke' };
    (prisma.joke.findUnique as jest.Mock).mockResolvedValue(joke);

    const res = await request(app).get('/jokes/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ joke });
  });

  it('responds with 404 if the joke is not found', async () => {
    (prisma.joke.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/jokes/1');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Joke not found' });
  });
});

describe('handleNewJoke', () => {
  it('responds with 201 and the created joke if insert is successful', async () => {
    const joke = { id: 1, content: 'Test joke' };
    (prisma.joke.create as jest.Mock).mockResolvedValue(joke);

    const res = await request(app)
      .post('/jokes')
      .send({ content: 'Test joke' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'Joke created successfully',
      joke
    });
  });

  it('responds with 500 and an error message if an error occurs', async () => {
    (prisma.joke.create as jest.Mock).mockRejectedValue(new Error());

    const res = await request(app)
      .post('/jokes')
      .send({ content: 'Test joke' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'An error occurred while creating the joke'
    });
  });
});
