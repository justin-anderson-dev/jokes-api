import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { checkToken } from '../middleware/checkToken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

const app = express();
app.use((req, res, next) => {
  req.headers['authorization'] = 'Bearer token';
  next();
});
app.use(checkToken);
app.use((req, res) => res.status(200).json({ message: 'Success' }));

describe('checkToken', () => {
  it('responds with 401 if the token is not present', async () => {
    const app = express();
    app.use(checkToken);
    app.use((req, res) => res.status(200).json({ message: 'Success' }));

    const res = await request(app).get('/');

    expect(res.status).toBe(401);
  });

  it('responds with 401 if the token is invalid or missing', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    const res = await request(app).get('/');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Missing or invalid token' });
  });

  it('calls next if the token is valid', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({});

    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Success' });
  });
});
