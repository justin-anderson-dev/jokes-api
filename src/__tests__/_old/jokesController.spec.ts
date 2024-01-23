import { MockContext, Context, createMockContext } from '../../context';
import * as controller from '../controllers/jokesController';
import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/checkToken';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe('handleGetAllJokes', () => {
  // ... existing tests ...
  const req = {
    tokenPayload: {
      token: {
        userId: 1,
        userName: 'testUser',
        userRole: 'Admin'
      }
    },
    params: {
      id: '1'
    }
  } as Partial<CustomRequest>;

  const res = {} as Response;

  it('should call prisma.joke.findMany', async () => {
    await controller.handleGetAllJokes(req as CustomRequest, res as Response);

    expect(mockCtx.prisma.joke.findMany).toHaveBeenCalled();
  });

  it('should respond with status 200', async () => {
    await controller.handleGetAllJokes(req as CustomRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should respond with the jokes from prisma.joke.findMany', async () => {
    const expectedJokes = [
      { id: 1, content: 'Test joke 1' },
      { id: 2, content: 'Test joke 2' }
    ];
    mockCtx.prisma.joke.findMany.mockResolvedValue(expectedJokes);

    await controller.handleGetAllJokes(req as CustomRequest, res as Response);

    expect(res.json).toHaveBeenCalledWith({ jokes: expectedJokes });
  });
});
