import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import * as config from '../config';

// customRequest interface extends the default Request interface to include the token payload
// makes the token payload available to controllers via req.tokenPayload

export interface CustomRequest extends Request {
  tokenPayload: JwtPayload;
}

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  // Gets JWT from the Authorization header
  const authHeader = req.headers['authorization'];
  let jwtPayload: JwtPayload;
  if (!authHeader) {
    // Handle the case where the token is not present
    return res.sendStatus(401);
  }
  const token = <string>authHeader.split(' ')[1];

  try {
    // validates token and verifies payload fields
    jwtPayload = verify(token, config.jwt_secret!, {
      complete: true,
      issuer: config.jwt_issuer,
      audience: config.jwt_audience,
      algorithms: ['HS256'],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false
    });
    // if valid, adds token payload to req.tokenPayload
    (req as CustomRequest).tokenPayload = jwtPayload;
  } catch {
    // handles 401 errors if token is invalid or missing
    res.status(401).json({ message: 'Missing or invalid token' });
    return;
  }
  // passes flow of control to next middleware if token is valid
  next();
};
