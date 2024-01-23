import express from 'express';
import request from 'supertest';
import { handleGetJokesByUserId } from '../controllers/userJokesController';
import { prisma } from '../index';
import * as permissions from '../util/permissions';

jest.mock('../index', () => ({
  prisma: {
    joke: {
      findMany: jest.fn()
    }
  }
}));

jest.mock('../util/permissions', () => ({
  subjectHasThisId: jest.fn(),
  subjectIsAdmin: jest.fn()
}));

const app = express();
app.get('/users/:id/jokes', handleGetJokesByUserId);

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
