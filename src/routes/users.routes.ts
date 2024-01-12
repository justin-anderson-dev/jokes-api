import { Router, Request, Response } from 'express';

const router = Router();

// GET /users
router.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'GET /api/v1/users' });
});

// GET /users/:id
router.get('/:id', async (req: Request, res: Response) => {
  // TODO: build response
  const result: string = `GET /api/v1/users/${req.params.id}`;
  res.status(200).json({ user: result });
});

// POST /users
router.post('/', async (req: Request, res: Response) => {
  //TODO: build response
  res.status(201).json({ user: req.body, message: 'POST /api/v1/users' });
});

export default router;
