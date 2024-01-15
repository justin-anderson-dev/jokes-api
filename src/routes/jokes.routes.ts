import { Router, Request, Response } from 'express';
import Joke from '../models/joke';
import database from '../database';

const router = Router();

// GET /jokes
router.get('/', async (req: Request, res: Response) => {
  const jokes = await Joke.findAll();
  res.status(200).json({ jokes: jokes });
});

export default router;
