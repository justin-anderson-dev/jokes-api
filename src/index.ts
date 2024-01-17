import { PrismaClient } from '@prisma/client';
import express, { Express, Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.routes';
import jokesRoutes from './routes/jokes.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

import { port } from './config';

export const prisma: PrismaClient = new PrismaClient();

// Initialize Express app
export const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/jokes', jokesRoutes);
app.use('/api/v1/auth', authRoutes);

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'My API Server' });
});

export const server = http.createServer(app);
server.listen(port, () => {
  console.log(`API started at http://localhost:${port}`);
});
