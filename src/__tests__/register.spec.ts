import request from 'supertest';
import { server } from '../index';
import { prisma } from '../index';
import { User, Joke, UserJoke, Prisma } from '@prisma/client';
import { mock } from 'node:test';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('mockHashedPassword'))
}));
const mockHashedPassword = 'mockHashedPassword';

describe('Auth routes', () => {
  afterAll((done) => {
    server.close(done); // Close the server after all tests have completed
  });

  // POST - /users
  it('should create a new user and return the created user', async () => {
    const mockUser: User = {
      id: 3,
      username: 'test3@testemail.com',
      password: 'testpassword'
    };

    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      ...mockUser,
      password: mockHashedPassword
    });

    const response = await request(server).post('/api/v1/auth/register').send({
      username: mockUser.username,
      password: mockUser.password
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'test3@testemail.com',
        password: mockHashedPassword
      }
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: { ...mockUser, password: mockHashedPassword }
    });
  });

  it('should return a 409 error if the user already exists', async () => {
    jest.clearAllMocks();

    const existingUser: User = {
      id: 1,
      username: 'test1@testemail.com',
      password: 'testpassword'
    };

    jest.spyOn(prisma.user, 'create').mockImplementation(() => {
      throw new Prisma.PrismaClientKnownRequestError(
        'A unique constraint would be violated on User. Details: Field name = username',
        {
          clientVersion: '2.30.0',
          code: 'P2002',
          meta: {
            target: ['username']
          }
        }
      );
    });

    const response = await request(server).post('/api/v1/auth/register').send({
      username: existingUser.username,
      password: existingUser.password
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'test1@testemail.com',
        password: mockHashedPassword
      }
    });
    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Username already exists' });
  });

  it('should return 500 if an error occurs while registering', async () => {
    jest.clearAllMocks();

    jest.spyOn(prisma.user, 'create').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(server).post('/api/v1/auth/register').send({
      username: 'someguy1@testemail.com',
      password: 'testpassword'
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'An error occurred while creating the user'
    });
  });
});
