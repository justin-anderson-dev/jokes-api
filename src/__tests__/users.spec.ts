import request from 'supertest';
import express from 'express';
import {
  handleGetAllUsers,
  handleGetAUser,
  handleDeleteUser
} from '../controllers/usersController';
import * as permissions from '../util/permissions';
import { prisma } from '../index';
import { Prisma } from '@prisma/client';

// Mock all external functions and Prisma queries
jest.mock('../index', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn()
    },
    Prisma: {
      PrismaClientKnownRequestError: class {}
    }
  }
}));

jest.mock('../util/permissions', () => ({
  subjectIsAdmin: jest.fn(),
  subjectHasThisId: jest.fn()
}));

// Test requests made to /users endpoints using Supertest
const app = express();
app.use(express.json());
app.get('/users', handleGetAllUsers);
app.get('/users/:id', handleGetAUser);
app.delete('/users/:user', handleDeleteUser);

describe('handleGetAllUsers', () => {
  // No need to test negative case because the function is only called after the route handle authorizes the user
  it('responds with 200 and all users', async () => {
    const users = [
      { id: 1, name: 'Test User 1' },
      { id: 2, name: 'Test User 2' }
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ users });
  });
});

describe('handleGetAUser', () => {
  it('responds with 403 if the user is not authorized to access the record', async () => {
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(false);
    (permissions.subjectHasThisId as jest.Mock).mockReturnValue(false);

    const res = await request(app).get('/users/1');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('responds with 200 and the user if the user record is found', async () => {
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(true);
    const user = { id: 1, name: 'Test User' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    const res = await request(app).get('/users/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user });
  });
});

describe('handleDeleteUser', () => {
  it('responds with 403 if the user is not admin', async () => {
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(false);

    const res = await request(app).delete('/users/testuser');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('responds with 404 if the user is not found', async () => {
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(true);
    const error = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2025',
      clientVersion: '2.30.0',
      meta: {
        target: ['username']
      },
      message: 'User not found'
    };
    Object.setPrototypeOf(
      error,
      Prisma.PrismaClientKnownRequestError.prototype
    );

    (prisma.user.delete as jest.Mock).mockRejectedValue(error);

    const res = await request(app).delete('/users/testuser');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  it('responds with 200 and the deleted user if the user is found by username', async () => {
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(true);
    const user = { id: 1, name: 'Test User' };
    (prisma.user.delete as jest.Mock).mockResolvedValue(user);

    const res = await request(app).delete('/users/testuser');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'User deleted successfully', user });
  });

  it('responds with 200 and the deleted user if the user is found by id', async () => {
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(true);
    const user = { id: 1, name: 'Test User' };
    (prisma.user.delete as jest.Mock).mockResolvedValue(user);

    const res = await request(app).delete('/users/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'User deleted successfully', user });
  });

  it('responds with 500 and an error message if an error occurs', async () => {
    (permissions.subjectIsAdmin as jest.Mock).mockReturnValue(true);
    (prisma.user.delete as jest.Mock).mockRejectedValue(new Error());

    const res = await request(app).delete('/users/1');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'An error occurred while deleting the user'
    });
  });
});
