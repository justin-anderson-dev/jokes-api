import { Prisma } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import {
  handleDeleteUser,
  handleGetAUser,
  handleGetAllUsers
} from '../controllers/usersController';
import { handleGetJokesByUserId } from '../controllers/userJokesController';

const router = Router();

// GET - /users
router.get('/', handleGetAllUsers);

// GET - /users/:id/jokes
router.get('/:id/jokes', handleGetJokesByUserId);

// GET - /users/:id
router.get('/:id', handleGetAUser);

// DELETE - /users/:id (delete by id or username property)
router.delete('/:user', handleDeleteUser);

// POST - /users/:id/jokes (add a joke to a user's list of jokes)
router.post('/:id/jokes', async (req: Request, res: Response) => {
  const { jokeId, userId } = req.body;
  const join = await prisma.userJoke.create({
    data: {
      jokeId: Number(jokeId),
      userId: Number(userId)
    }
  });
  const result = await prisma.joke.findUnique({
    where: { id: Number(join.jokeId) }
  });
  res
    .status(201)
    .json({ message: 'UserJoke connected successfully', joke: result });
});

export default router;
