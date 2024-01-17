import { Request, Response } from 'express';
import { prisma } from '..';
import { compare } from 'bcrypt';

export const handleLogin = async (req: Request, res: Response) => {
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
};
