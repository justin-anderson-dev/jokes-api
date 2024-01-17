import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '..';
import { hash } from 'bcrypt';

export const handleNewUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword }
    });
    // TODO: Redirect to login page / login user
    res.status(201).json({ user: newUser });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      res
        .status(500)
        .json({ error: 'An error occurred while creating the user' });
    }
  }
};
