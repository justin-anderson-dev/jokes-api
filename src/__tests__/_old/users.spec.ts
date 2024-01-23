import request from 'supertest';
import { server } from '../../index';
import { prisma } from '../../index';
import { User, Joke, UserJoke, Prisma } from '@prisma/client';
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
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

    const response = await request(server).get('/api/v1/users/1');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: mockUser });
  });

  // GET /users/:id/jokes
  it('should return all jokes associated with a user', async () => {
    const mockJokes: Joke[] = [
      { id: 1, content: 'Test joke 1' },
      { id: 2, content: 'Test joke 2' }
    ];

    const mockUserJokes = mockJokes.map((joke) => ({
      userId: 1,
      jokeId: joke.id,
      joke
    }));

    jest.spyOn(prisma.joke, 'findMany').mockResolvedValue(mockJokes);

    const response = await request(server).get('/api/v1/users/1/jokes');

    expect(prisma.joke.findMany).toHaveBeenCalledWith({
      where: { users: { some: { userId: 1 } } }
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ jokes: mockJokes });
  });

  it('should return a 404 error if the user is not found', async () => {
    jest.spyOn(prisma.joke, 'findMany').mockResolvedValue([]);

    const response = await request(server).get('/api/v1/users/1/jokes');

    expect(prisma.joke.findMany).toHaveBeenCalledWith({
      where: { users: { some: { userId: 1 } } }
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'User not found or user has no jokes'
    });
  });

  // test DELETE - users/:id
  // test DELETE - users/:user
  describe('DELETE /api/v1/users/:user', () => {
    it('should delete a user by id and return a success message', async () => {
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser);

      const response = await request(server).delete('/api/v1/users/1');

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'User deleted successfully',
        user: mockUser
      });
    });

    it('should return a 404 error if the user with the specified id is not found', async () => {
      jest.spyOn(prisma.user, 'delete').mockImplementation(() => {
        throw new Prisma.PrismaClientKnownRequestError(
          'No user found for the specified id',
          {
            clientVersion: '2.30.0',
            code: 'P2025',
            meta: {
              target: ['id']
            }
          }
        );
      });

      const response = await request(server).delete('/api/v1/users/1');

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'User not found'
      });
    });

    it('should delete a user by username and return a success message', async () => {
      const mockUser: User = {
        id: 1,
        username: 'test1@testemail.com',
        password: 'testpassword'
      };

      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser);

      const response = await request(server).delete(
        '/api/v1/users/test1@testemail.com'
      );

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { username: 'test1@testemail.com' }
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'User deleted successfully',
        user: mockUser
      });
    });
  });

  // test POST - users/:id/jokes (add a joke to a user's list of jokes)
  it('should add a joke to a user and return the joke', async () => {
    const mockJoke: Joke = {
      id: 1,
      content: 'Test joke 1'
    };

    const mockUserJoke: UserJoke = {
      jokeId: mockJoke.id,
      userId: 1
    };

    jest.spyOn(prisma.userJoke, 'create').mockResolvedValue(mockUserJoke);
    jest.spyOn(prisma.joke, 'findUnique').mockResolvedValue(mockJoke);

    const response = await request(server).post('/api/v1/users/1/jokes').send({
      jokeId: mockJoke.id,
      userId: 1
    });

    expect(prisma.userJoke.create).toHaveBeenCalledWith({
      data: {
        jokeId: mockJoke.id,
        userId: 1
      }
    });
    expect(prisma.joke.findUnique).toHaveBeenCalledWith({
      where: { id: mockJoke.id }
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'UserJoke connected successfully',
      joke: mockJoke
    });
  });
});
