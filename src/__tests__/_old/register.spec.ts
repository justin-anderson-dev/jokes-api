import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { handleNewUser } from '../../controllers/registerController';

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

const mockHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        user: {
          create: jest.fn()
        }
      };
    })
  };
});

const mockPrisma = PrismaClient.prototype as jest.Mocked<PrismaClient>;

describe('handleNewUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        username: 'testUser',
        password: 'testPassword'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  type HashFunction = (
    data: string | Buffer,
    saltOrRounds: string | number
  ) => Promise<string>;

  const mockHash = jest.fn() as jest.MockedFunction<HashFunction>;

  it('creates a new user and returns a status of 201', async () => {
    const hashedPassword = 'hashedPassword';
    mockHash.mockResolvedValue(hashedPassword);

    const newUser: User = {
      id: 1,
      username: req.body.username,
      password: hashedPassword,
      role: 'User'
    };
    (mockPrisma.user.create as jest.MockedFunction<any>).mockResolvedValue(
      newUser
    );

    await handleNewUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: newUser });
  });

  // it('returns a status of 409 if the username already exists', async () => {
  //   mockPrisma.user.create.mockRejectedValue(
  //     new Prisma.PrismaClientKnownRequestError(
  //       'Username already exists',
  //       'P2002'
  //     )
  //   );

  //   await handleNewUser(req as Request, res as Response);

  //   expect(res.status).toHaveBeenCalledWith(409);
  //   expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
  // });

  // it('returns a status of 500 if an unexpected error occurs', async () => {
  //   mockPrisma.user.create.mockRejectedValue(new Error());

  //   await handleNewUser(req as Request, res as Response);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: 'An error occurred while creating the user'
  //   });
  // });
});
