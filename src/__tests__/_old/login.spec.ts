import request from 'supertest';
import { server } from '../index';
import { prisma } from '../index';
import * as bcrypt from 'bcrypt';
import { mock } from 'node:test';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('mockHashedPassword')),
  compare: jest.fn(() => Promise.resolve(true)) // Mocks bcrypt.compare to always return true
}));
const mockHashedPassword = 'mockHashedPassword';

describe('Login routes', () => {
  afterAll((done) => {
    server.close(done); // Close the server after all tests have completed
  });

  it('should return 404 if the user does not exist', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const response = await request(server).post('/api/v1/auth/login').send({
      username: 'nonexistent@testemail.com',
      password: 'testpassword'
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  it('should return 401 if the password is invalid', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));

    const existingUser = {
      id: 1,
      username: 'test1@testemail.com',
      password: mockHashedPassword
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(existingUser);

    const response = await request(server).post('/api/v1/auth/login').send({
      username: existingUser.username,
      password: 'wrongpassword'
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid password' });
  });

  it('should return 200 and the user object if the login is successful', async () => {
    const existingUser = {
      id: 1,
      username: 'test1@testemail.com',
      password: mockHashedPassword
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(existingUser);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const response = await request(server).post('/api/v1/auth/login').send({
      username: existingUser.username,
      password: 'testpassword'
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login successful',
      user: {
        id: existingUser.id,
        username: existingUser.username,
        password: mockHashedPassword
      }
    });
  });

  it('should return 500 if an error occurs while logging in', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(server).post('/api/v1/auth/login').send({
      username: 'test1@testemail.com',
      password: 'testpassword'
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'An error occurred while logging in'
    });
  });
});
