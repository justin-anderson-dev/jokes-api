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
  if (!result) {
    return res.status(404).json({ error: 'Joke not found' });
  }
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

export const handleDeleteJoke = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const result = await prisma.joke.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ message: 'Joke deleted successfully', result });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the joke' });
  }
};
