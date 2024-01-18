import { Request, Response } from 'express';
import { prisma } from '..';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import * as config from '../config';

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
    }
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
        // Generate JWT that expires in 1h
        const token = sign(
          { userId: user.id, username: user.username },
          config.jwt_secret!,
          {
            expiresIn: '1h',
            notBefore: '0',
            algorithm: 'HS256',
            audience: config.jwt_audience,
            issuer: config.jwt_issuer
          }
        );

        // Return JWT in response
        res.status(200).json({ jokeToken: token });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};
