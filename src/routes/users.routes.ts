import { PrismaClient, Prisma } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET - users
router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ users: users });
});

// GET - users/:id/jokes (get all jokes for a user)
router.get('/:id/jokes', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await prisma.joke.findMany({
    where: { users: { some: { userId: Number(id) } } }
  });
  if (result === null) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.status(200).json({ jokes: result });
  }
});

// GET - users/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await prisma.user.findUnique({
    where: { id: Number(id) }
  });
  res.status(200).json({ user: result });
});

// POST - users
router.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = await prisma.user.create({
      data: { ...req.body }
    });
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
});

// DELETE - users/:id (delete by id or username property)
router.delete('/:user', async (req: Request, res: Response) => {
  const idOrUsername = req.params.user;
  let result;
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
    res.status(200).json({ message: 'User deleted successfully' });
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
});

export default router;
