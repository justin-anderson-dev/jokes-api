import { Router, Request, Response } from 'express';

const router = Router();

// GET /jokes
router.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'GET /api/v1/jokes' });
});

export default router;
