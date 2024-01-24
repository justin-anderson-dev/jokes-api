import { Router } from 'express';
import { checkToken } from '../middleware/checkToken';
import { checkRole } from '../middleware/checkRole';
import { RoleName } from '@prisma/client';
import * as jokesController from '../controllers/jokesController';

const router = Router();

// GET /jokes
router.get('/', jokesController.handleGetAllJokes);

// GET /jokes/:id
router.get('/:id', jokesController.handleGetAJoke);

// POST /jokes
router.post(
  '/',
  [checkToken, checkRole([RoleName.User, RoleName.Admin])],
  jokesController.handleNewJoke
);

// DELETE /jokes/:id
router.delete(
  '/:id',
  [checkToken, checkRole([RoleName.Admin])],
  jokesController.handleDeleteJoke
);

export default router;
