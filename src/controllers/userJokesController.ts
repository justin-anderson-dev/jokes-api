import { Request, Response } from 'express';
import { prisma } from '../index';

export const handleGetJokesByUserId = async (req: Request, res: Response) => {
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

export const handleAddJokeToUser = async (req: Request, res: Response) => {
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
