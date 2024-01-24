import express from 'express';
import request from 'supertest';
import {
  handleGetJokesByUserId,
  handleAddJokeToUser,
  handleDeleteJokeFromUser
} from '../controllers/userJokesController';
import { prisma } from '../index';
import * as permissions from '../util/permissions';

// All external functions and Prisma queries are mocked using Jest's jest.fn() function
jest.mock('../index', () => ({
  prisma: {
    userJoke: {
      create: jest.fn(),
      delete: jest.fn()
    },
    joke: {
      findMany: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

jest.mock('../util/permissions', () => ({
  subjectHasThisId: jest.fn(),
  subjectIsAdmin: jest.fn()
}));

// Test requests made to /users/:id/jokes endpoints using Supertest
const app = express();
app.use(express.json());
app.post('/users/:id/jokes', handleAddJokeToUser);
app.get('/users/:id/jokes', handleGetJokesByUserId);
app.delete('/users/:id/jokes', handleDeleteJokeFromUser);

describe('handleGetJokesByUserId', () => {
  it('responds with 403 if the user is not authorized', async () => {
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(false);
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(false);

    const res = await request(app).get('/users/1/jokes');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('responds with 404 if the user is not found or has no jokes', async () => {
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(true);
    (prisma.joke.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/users/1/jokes');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found or user has no jokes' });
  });

  it('responds with 200 and the jokes if the user is found and has jokes', async () => {
    const jokes = [{ id: 1, text: 'Test joke' }];
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(true);
    (prisma.joke.findMany as jest.Mock).mockResolvedValue(jokes);

    const res = await request(app).get('/users/1/jokes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ jokes });
  });
});
describe('handleAddJokeToUser', () => {
  it('responds with 403 if the user is unauthorized', async () => {
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(false);
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(false);

    const res = await request(app)
      .post('/users/1/jokes')
      .send({ jokeId: 1, userId: 1 });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('responds with 201 and the created joke if the user is authorized', async () => {
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(true);
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(true);
    (prisma.userJoke.create as jest.Mock).mockResolvedValue({
      jokeId: 1,
      userId: 1
    });
    (prisma.joke.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      content: 'Test joke'
    });

    const res = await request(app)
      .post('/users/1/jokes')
      .send({ jokeId: 1, userId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'UserJoke connected successfully',
      joke: { id: 1, content: 'Test joke' }
    });
  });
});

describe('handleDeleteJokeFromUser', () => {
  it('responds with 403 if the user is unauthorized', async () => {
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(false);
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(false);

    const res = await request(app)
      .delete('/users/1/jokes')
      .send({ jokeId: 1, userId: 1 });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('responds with 200 and the deleted joke if the user is authorized', async () => {
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(true);
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(true);
    (prisma.userJoke.delete as jest.Mock).mockResolvedValue({
      jokeId: 1,
      userId: 1
    });

    const res = await request(app)
      .delete('/users/1/jokes')
      .send({ jokeId: 1, userId: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'UserJoke deleted successfully',
      result: { jokeId: 1, userId: 1 }
    });
  });
});
