import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Prisma } from '@/generated/prisma/client';

import { apiErrorHandler, checkContentType, unmatchedRoutes } from '../api-error.middleware';

describe('apiErrorHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { log: { error: vi.fn(), info: vi.fn() } as any };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn(), send: vi.fn() };
    next = vi.fn();
  });

  it('returns 400 for a JSON syntax error', () => {
    const err = Object.assign(new SyntaxError('Unexpected token'), { status: 400, body: '{' });

    apiErrorHandler(err as any, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('does not expose raw Prisma error details and returns 400', () => {
    const err = Object.assign(Object.create(Prisma.PrismaClientValidationError.prototype), {
      message: 'internal prisma detail that should not leak',
    });

    apiErrorHandler(err as any, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const [payload] = (res.json as any).mock.calls[0];
    expect(JSON.stringify(payload)).not.toContain('internal prisma detail');
  });

  it('does not leak Prisma known-request meta to the client', () => {
    const err = Object.assign(Object.create(Prisma.PrismaClientKnownRequestError.prototype), {
      message: 'Known request error',
      meta: { field_name: 'email' },
    });

    apiErrorHandler(err as any, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const [payload] = (res.json as any).mock.calls[0];
    expect(JSON.stringify(payload)).not.toContain('email');
    expect(JSON.stringify(payload)).not.toContain('field_name');
  });

  it('logs the error and returns 500 for unrecognized errors', () => {
    const err = new Error('boom');

    apiErrorHandler(err as any, req as Request, res as Response, next);

    expect(req.log?.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('checkContentType', () => {
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), send: vi.fn() };
    next = vi.fn();
  });

  it('rejects a non-JSON content type on POST', () => {
    const req = {
      method: 'POST',
      get: vi.fn().mockReturnValue('text/plain'),
    } as unknown as Request;

    checkContentType(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next for application/json', () => {
    const req = {
      method: 'POST',
      get: vi.fn().mockReturnValue('application/json'),
    } as unknown as Request;

    checkContentType(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('allows application/json with charset', () => {
    const req = {
      method: 'POST',
      get: vi.fn().mockReturnValue('application/json; charset=utf-8'),
    } as unknown as Request;

    checkContentType(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('skips GET requests', () => {
    const req = { method: 'GET', get: vi.fn() } as unknown as Request;

    checkContentType(req, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('unmatchedRoutes', () => {
  it('returns 404', () => {
    const req = {
      log: { info: vi.fn() },
      method: 'GET',
      originalUrl: '/nope',
    } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;

    unmatchedRoutes(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
