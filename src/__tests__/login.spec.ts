import express from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { handleLogin } from '../controllers/loginController';
import { prisma } from '../index';

jest.mock('../index', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

const app = express();
app.use(express.json());
app.post('/login', handleLogin);

describe('handleLogin', () => {
  it('responds with 400 if username or password is not provided', async () => {
    const res = await request(app).post('/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Username and password are required' });
  });

  it('responds with 404 if the user is not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'test' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  it('responds with 401 if the password is invalid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      password: 'test'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'test' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid password' });
  });

  it('responds with 200 and a token if the password is valid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      password: 'test'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'test' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
