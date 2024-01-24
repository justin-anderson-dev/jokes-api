import express from 'express';
import request from 'supertest';
import { checkRole } from '../middleware/checkRole';
import { RoleName } from '@prisma/client';
import { prisma } from '../index';

// All external functions and Prisma queries are mocked using Jest's jest.fn() function
jest.mock('../index', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

const app = express();

// simulate the presence of a decoded JWT token in the request
app.use((req, res, next) => {
  (req as any).tokenPayload = {
    payload: {
      userId: 1
    }
  };
  next();
});
app.use(checkRole([RoleName.Admin]));

// simulate a route handler sending success message if checkRole passes
app.use((req, res) => res.status(200).json({ message: 'Success' }));

describe('checkRole middleware', () => {
  it('responds with 404 if the user is not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('responds with 403 if the user role is not in the roles array', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: RoleName.User
    });

    const res = await request(app).get('/');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });

  it('calls next if the user role is in the roles array', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: RoleName.Admin
    });

    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Success' });
  });
});
