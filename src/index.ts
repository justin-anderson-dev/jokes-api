import express, { Express, Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import database from './database';
import usersRoutes from './routes/users.routes';
import jokesRoutes from './routes/jokes.routes';
import { UserMap } from './models/user';
import { JokeMap } from './models/joke';
import { UserJokeMap } from './models/userjoke';
import { setupAssociations } from './associations';

dotenv.config();

import { port } from './config';

// Initialize models
JokeMap(database);
UserMap(database);
UserJokeMap(database);
setupAssociations(database);

// Initialize Express app
export const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/jokes', jokesRoutes);

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'My API Server' });
});

export const server = http.createServer(app);

// Sync with the database and start server if successful
database
  .sync()
  .then(() => {
    server.listen(port, () => {
      console.log(`API started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync with the database:', error);
  });
