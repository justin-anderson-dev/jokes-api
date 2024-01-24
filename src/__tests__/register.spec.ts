import express from 'express';
import request from 'supertest';
import { handleNewUser } from '../controllers/registerController';
import { prisma } from '../index';
import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';

// Mock the Prisma client and bcrypt
jest.mock('../index', () => ({
  prisma: {
    user: {
      create: jest.fn()
    }
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

// Test requests made to /auth/register endpoint using Supertest
const app = express();
app.use(express.json());
app.post('/auth/register', handleNewUser);

describe('handleNewUser', () => {
  it('responds with 201 and the new user if a user is successfully created', async () => {
    const user = { id: 1, username: 'test', password: 'hashedPassword' };
    (hash as jest.Mock).mockResolvedValue('hashedPassword');
    (prisma.user.create as jest.Mock).mockResolvedValue(user);

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'test', password: 'password' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ user });
  });

  it('responds with 409 if the username already exists', async () => {
    (hash as jest.Mock).mockResolvedValue('hashedPassword');

    // Mock the error object that Prisma would return
    const error = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
      clientVersion: '2.30.0',
      meta: {
        target: ['username']
      },
      message:
        'A unique constraint would be violated on User. Details: Field name = username'
    };
    // Modifying prototype is required to pass the instanceof check in the controller code
    Object.setPrototypeOf(
      error,
      Prisma.PrismaClientKnownRequestError.prototype
    );
    (prisma.user.create as jest.Mock).mockRejectedValue(error);

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'test', password: 'password' });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Username already exists' });
  });

  it('responds with 500 if an error occurs while creating the user', async () => {
    (hash as jest.Mock).mockResolvedValue('hashedPassword');
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error());

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'test', password: 'password' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'An error occurred while creating the user'
    });
  });
});
