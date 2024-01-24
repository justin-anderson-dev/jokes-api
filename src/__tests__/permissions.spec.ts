import * as permissions from '../util/permissions';
import { CustomRequest } from '../middleware/checkToken';
import { RoleName } from '@prisma/client';

describe('subjectHasThisId', () => {
  it('should return true if the subject id matches the request params id', () => {
    const req: Partial<CustomRequest> = {
      tokenPayload: {
        payload: {
          userId: '1'
        }
      },
      params: {
        id: '1'
      }
    };

    const result = permissions.subjectHasThisId(req as CustomRequest);
    expect(result).toBe(true);
  });

  it('should return false if the subject id does not match the request params id', () => {
    const req: Partial<CustomRequest> = {
      tokenPayload: {
        payload: {
          userId: '1'
        }
      },
      params: {
        id: '2'
      }
    };

    const result = permissions.subjectHasThisId(req as CustomRequest);
    expect(result).toBe(false);
  });
});

describe('subjectHasThisUsername', () => {
  it('should return true if the subject username matches the request params username', () => {
    const req: Partial<CustomRequest> = {
      tokenPayload: {
        payload: {
          userName: 'testUser'
        }
      },
      params: {
        user: 'testUser'
      }
    };

    const result = permissions.subjectHasThisUsername(req as CustomRequest);
    expect(result).toBe(true);
  });

  it('should return false if the subject username does not match the request params username', () => {
    const req: Partial<CustomRequest> = {
      tokenPayload: {
        payload: {
          userName: 'testUser'
        }
      },
      params: {
        user: 'differentUser'
      }
    };

    const result = permissions.subjectHasThisUsername(req as CustomRequest);
    expect(result).toBe(false);
  });
});

describe('subjectIsAdmin', () => {
  it('should return true if the subject role is Admin', () => {
    const req: Partial<CustomRequest> = {
      tokenPayload: {
        payload: {
          userRole: RoleName.Admin
        }
      }
    };

    const result = permissions.subjectIsAdmin(req as CustomRequest);
    expect(result).toBe(true);
  });

  it('should return false if the subject role is not Admin', () => {
    const req: Partial<CustomRequest> = {
      tokenPayload: {
        payload: {
          userRole: RoleName.User // or any other role that is not Admin
        }
      }
    };

    const result = permissions.subjectIsAdmin(req as CustomRequest);
    expect(result).toBe(false);
  });
});
