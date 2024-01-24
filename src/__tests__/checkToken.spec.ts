import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { checkToken } from '../middleware/checkToken';

// Mock external function calls
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

const app = express();
// simulate the presence of authorization header in the request
app.use((req, res, next) => {
  req.headers['authorization'] = 'Bearer token';
  next();
});
app.use(checkToken);
// simulate a route handler sending success message if checkToken passes
app.use((req, res) => res.status(200).json({ message: 'Success' }));

describe('checkToken middleware', () => {
  it('responds with 401 if the token is invalid or missing', async () => {
    // simulate jwt.verify throwing an error
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
