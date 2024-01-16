import request from 'supertest';
import { server } from '../index';
import { prisma } from '../index';
import { User, Joke } from '@prisma/client';
import { mock } from 'node:test';

// Set up test data
const mockUsers: User[] = [
  { id: 1, username: 'test1@testemail.com', password: 'testpassword' },
  { id: 2, username: 'test2@testemail.com', password: 'testpassword' }
];
const mockUser: User = {
  id: 1,
  username: 'test1@testemail.com',
  password: 'testpassword'
};

// Execute tests
describe('Users routes', () => {
  afterAll((done) => {
    server.close(done); // Close the server after all tests have completed
  });

  it('should return all users', async () => {
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers);

    const response = await request(server).get('/api/v1/users');

    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users: mockUsers });
  });

  it('should return a user by id', async () => {
    const mockUser = {
      id: 1,
      username: 'test1@testemail.com',
      password: 'testpassword'
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

    const response = await request(server).get('/api/v1/users/1');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: mockUser });
  });

  // Add more tests for other routes and scenarios
});
