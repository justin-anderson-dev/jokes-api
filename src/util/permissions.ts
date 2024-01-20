import { Request } from 'express';
import { CustomRequest } from '../middleware/checkToken';
import { RoleName } from '@prisma/client';

export function subjectHasThisId(req: Request) {
  const subjectId = Number((req as CustomRequest).tokenPayload.payload.userId);
  const userId = Number(req.params.id);
  return subjectId === userId;
}

export function subjectHasThisUsername(req: Request) {
  const subjectUsername: string = (req as CustomRequest).tokenPayload.payload
    .userName;
  const username: string = String(req.params.user);
  return subjectUsername === username;
}

export function subjectIsAdmin(req: Request) {
  const subjectRole: string = (req as CustomRequest).tokenPayload.payload
    .userRole;
  return subjectRole === RoleName.Admin;
}
