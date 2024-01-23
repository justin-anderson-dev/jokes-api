import { Request, Response, NextFunction } from 'express';
import { checkRole } from '../../middleware/checkRole';
import { RoleName, User } from '@prisma/client';
import { CustomRequest } from '../../middleware/checkToken';
import { prismaMock } from '../../../__mocks__/prismaMock';

describe('checkRole', () => {
  it('should call next if the user role is in the roles array', async () => {
    const user: User = {
      id: 1,
      username: 'testUser',
      password: 'testPassword',
      role: RoleName.Admin
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    // Create mock versions of req, res, and next
    const req = {
      tokenPayload: {
        token: {
          userId: 1,
          userName: 'testUser',
          userRole: RoleName.Admin
        }
      },
      params: {
        id: '1'
      }
    } as Partial<CustomRequest>;

    const res = {} as Response;

    const next = jest.fn() as NextFunction;

    await checkRole([RoleName.Admin])(req as Request, res, next);

    expect(next).toHaveBeenCalled();
  });
});
