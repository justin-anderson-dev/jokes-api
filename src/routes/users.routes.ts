import { Router } from 'express';
import { checkToken } from '../middleware/checkToken';
import { checkRole } from '../middleware/checkRole';
import { RoleName } from '@prisma/client';

import {
  handleDeleteUser,
  handleGetAUser,
  handleGetAllUsers
} from '../controllers/usersController';
import {
  handleAddJokeToUser,
  handleGetJokesByUserId,
  handleDeleteJokeFromUser
} from '../controllers/userJokesController';

const router = Router();

// GET - /users
router.get('/', [checkToken, checkRole([RoleName.Admin])], handleGetAllUsers);

// GET - /users/:id
router.get(
  '/:id',
  [checkToken, checkRole([RoleName.User, RoleName.Admin])],
  handleGetAUser
);

// GET - /users/:id/jokes
router.get(
  '/:id/jokes',
  [checkToken, checkRole([RoleName.User, RoleName.Admin])],
  handleGetJokesByUserId
);

//TODO: Add route for updating user

// DELETE - /users/:id
router.delete(
  '/:user',
  [checkToken, checkRole([RoleName.Admin])],
  handleDeleteUser
);

// POST - /users/:id/jokes
router.post(
  '/:id/jokes',
  [checkToken, checkRole([RoleName.User, RoleName.Admin])],
  handleAddJokeToUser
);

// DELETE - /users/:id/jokes
router.delete(
  '/:id/jokes',
  [checkToken, checkRole([RoleName.User, RoleName.Admin])],
  handleDeleteJokeFromUser
);

export default router;
