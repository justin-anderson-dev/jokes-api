import { Request } from 'express';
import { CustomRequest } from '../middleware/checkToken';
import { RoleName } from '@prisma/client';

export function subjectHasThisId(req: Request) {
  const subjectId = (req as CustomRequest).tokenPayload.payload.userId;
  const userId = req.params.id;
  return subjectId === userId;
}

export function subjectHasThisUsername(req: Request) {
  const subjectUsername = (req as CustomRequest).tokenPayload.payload.userName;
  const username = req.params.user;
  return subjectUsername === username;
}

export function subjectIsAdmin(req: Request) {
  const subjectRole = (req as CustomRequest).tokenPayload.payload.userRole;
  return subjectRole === RoleName.Admin;
}
