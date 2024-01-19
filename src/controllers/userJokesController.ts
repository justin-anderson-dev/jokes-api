import { Request, Response } from 'express';
import { prisma } from '../index';
import * as permissions from '../util/permissions';

// USER role users can only get their own jokes
// ADMIN role users can get any user's jokes'
export const handleGetJokesByUserId = async (req: Request, res: Response) => {
  if (!permissions.subjectHasThisId && !permissions.subjectIsAdmin(req)) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }
  const id = Number(req.params.id);
  const result = await prisma.joke.findMany({
    where: { users: { some: { userId: Number(id) } } }
  });
  if (result === null || result.length === 0) {
    res.status(404).json({ error: 'User not found or user has no jokes' });
  } else {
    res.status(200).json({ jokes: result });
  }
};

// USER role users can only add jokes to their own list
// ADMIN role users can add jokes to any user's list
export const handleAddJokeToUser = async (req: Request, res: Response) => {
  if (!permissions.subjectHasThisId && !permissions.subjectIsAdmin(req)) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }
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
};
