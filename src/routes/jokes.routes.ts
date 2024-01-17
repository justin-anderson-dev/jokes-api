import { Router } from 'express';
import * as jokesController from '../controllers/jokesController';

const router = Router();

// GET /jokes
router.get('/', jokesController.handleGetAllJokes);

// GET /jokes/:id
router.get('/:id', jokesController.handleGetAJoke);

// POST /jokes
router.post('/', jokesController.handleNewJoke);

export default router;
