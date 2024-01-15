import { Router, Request, Response } from 'express';
import User from '../models/user';
import { UniqueConstraintError } from 'sequelize';

const router = Router();

// GET - users
router.get('/', async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ users: users });
});

// GET - users/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await User.findByPk(id);
  res.status(200).json({ user: result });
});

// POST - users
router.post('/', async (req: Request, res: Response) => {
  let newUser = req.body;
  try {
    const result = await User.create(newUser);
    newUser = result.dataValues as User;
    res.status(201).json({ user: newUser });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
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

  if (isNaN(Number(idOrUsername))) {
    // If 'user' is not a number, treat it as a username
    result = await User.destroy({ where: { username: idOrUsername } });
  } else {
    // If 'user' is a number, treat it as an id
    result = await User.destroy({ where: { id: Number(idOrUsername) } });
  }

  if (result) {
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// GET - users/:id/jokes
router.get('/:id/jokes', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const jokes = await user.getJokes();
  res.status(200).json({ jokes: jokes });
});

export default router;
