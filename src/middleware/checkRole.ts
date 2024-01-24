import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from './checkToken';
import { prisma } from '../index';
import { User, RoleName } from '@prisma/client';

export const checkRole = (roles: Array<RoleName>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user: User | null = await prisma.user.findUnique({
      where: { id: (req as CustomRequest).tokenPayload.payload.userId }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (roles.indexOf(user.role) > -1) {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
  };
};
