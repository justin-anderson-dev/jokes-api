import { Request, Response } from 'express';
import * as controller from '../../controllers/jokesController';
import { PrismaClient } from '@prisma/client';
import { CustomRequest } from '../../middleware/checkToken';

type MockPrismaJokeModel = {
  findMany: jest.Mock;
  findUnique: jest.Mock;
  // add other methods as needed
};

type MockPrismaRoleModel = {
  Admin: string;
  User: string;
};

type MockPrismaClient = {
  joke: MockPrismaJokeModel;
  rolename: MockPrismaRoleModel;
  // add other models as needed
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        joke: {
          findMany: jest.fn(),
          findUnique: jest.fn()
          // mock other methods here
        },
        rolename: {
          Admin: 'Admin',
          User: 'User'
        } // mock other models here
      };
    })
  };
});

const prismaMock = new PrismaClient() as unknown as MockPrismaClient;

prismaMock.joke.findMany.mockResolvedValue([
  { id: 1, content: 'Test joke 1' },
  { id: 2, content: 'Test joke 2' }
]);

prismaMock.joke.findUnique.mockResolvedValue({
  id: 1,
  content: 'Test joke 1'
});

describe('handleGetAllJokes', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Set up req and res objects
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return all jokes', async () => {
    await controller.handleGetAllJokes(req as CustomRequest, res as Response);

    expect(prismaMock.joke.findMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      jokes: [
        { id: 1, content: 'Test joke 1' },
        { id: 2, content: 'Test joke 2' }
      ]
    });
  });
});
