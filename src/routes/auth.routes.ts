import { Prisma } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { prisma } from '..';
import { hash, compare } from 'bcrypt';

const router = Router();

// POST - /auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword }
    });
    // TODO: Redirect to login page / login user
    res.status(201).json({ user: newUser });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      res
        .status(500)
        .json({ error: 'An error occurred while creating the user' });
    }
  }
});

// POST - /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const passwordValid = await compare(password, user.password);
      if (!passwordValid) {
        res.status(401).json({ error: 'Invalid password' });
      } else {
        // TODO: Redirect to home page / login user
        res.status(200).json({ message: 'Login successful', user });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});

export default router;
