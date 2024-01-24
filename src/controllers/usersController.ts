import { Request, Response } from 'express';
import { prisma } from '../index';
import { Prisma, User } from '@prisma/client';
import * as permissions from '../util/permissions';

// only admins can get all user records
export const handleGetAllUsers = async (req: Request, res: Response) => {
  const users: User[] | null = await prisma.user.findMany();
  res.status(200).json({ users: users });
};

export const handleGetAUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // USER role users can only get their own user info
  // ADMIN role users can get any user info
  if (!permissions.subjectIsAdmin(req) && !permissions.subjectHasThisId(req)) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  } else {
    const result: User | null = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    res.status(200).json({ user: result });
  }
};

//Only admins can delete users
export const handleDeleteUser = async (req: Request, res: Response) => {
  const idOrUsername = req.params.user;
  let result: User | null;
  if (!permissions.subjectIsAdmin(req)) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  try {
    if (isNaN(Number(idOrUsername))) {
      // If 'user' is not a number, treat it as a username
      result = await prisma.user.delete({ where: { username: idOrUsername } });
    } else {
      // If 'user' is a number, treat it as an id
      result = await prisma.user.delete({
        where: { id: Number(idOrUsername) }
      });
    }
    res
      .status(200)
      .json({ message: 'User deleted successfully', user: result });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res
        .status(500)
        .json({ error: 'An error occurred while deleting the user' });
    }
  }
};
