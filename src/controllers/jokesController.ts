import { Request, Response } from 'express';
import { prisma } from '..';

export const handleGetAllJokes = async (req: Request, res: Response) => {
  const jokes = await prisma.joke.findMany();
  res.status(200).json({ jokes: jokes });
};

export const handleGetAJoke = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await prisma.joke.findUnique({
    where: { id: Number(id) }
  });
  res.status(200).json({ joke: result });
};

export const handleNewJoke = async (req: Request, res: Response) => {
  try {
    const newJoke = await prisma.joke.create({
      data: { ...req.body }
    });
    res.status(201).json({
      message: 'Joke created successfully',
      joke: newJoke
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the joke' });
  }
};
