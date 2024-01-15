import { Router, Request, Response } from 'express';
import { prisma } from '..';

const router = Router();

// GET /jokes
router.get('/', async (req: Request, res: Response) => {
  const jokes = await prisma.joke.findMany();
  res.status(200).json({ jokes: jokes });
});

export default router;
