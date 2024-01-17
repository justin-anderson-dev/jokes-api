import { Router } from 'express';

import {
  handleDeleteUser,
  handleGetAUser,
  handleGetAllUsers
} from '../controllers/usersController';
import {
  handleAddJokeToUser,
  handleGetJokesByUserId
} from '../controllers/userJokesController';

const router = Router();

// GET - /users
router.get('/', handleGetAllUsers);

// GET - /users/:id/jokes
router.get('/:id/jokes', handleGetJokesByUserId);

// GET - /users/:id
router.get('/:id', handleGetAUser);

// DELETE - /users/:id
router.delete('/:user', handleDeleteUser);

// POST - /users/:id/jokes
router.post('/:id/jokes', handleAddJokeToUser);

export default router;
