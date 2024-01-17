import { Router } from 'express';
import { handleNewUser } from '../controllers/registerController';
import { handleLogin } from '../controllers/loginController';

const router = Router();

// POST /auth/register
router.post('/register', handleNewUser);

// POST - /auth/login
router.post('/login', handleLogin);

export default router;
