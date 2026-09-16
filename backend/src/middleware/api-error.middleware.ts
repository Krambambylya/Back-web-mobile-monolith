import { NextFunction, Request, Response } from 'express';
import { unifiedResponse } from 'uni-response';

import { Prisma } from '@/generated/prisma/client';

import { ERROR } from '../constants/messages';

const JSON_CONTENT_TYPE = /^application\/json(?:\s*;.*)?$/i;

const checkContentType = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    next();
    return;
  }

  const contentType = req.get('Content-Type') ?? '';

  if (!JSON_CONTENT_TYPE.test(contentType)) {
    const response = unifiedResponse(false, 'Only application/json Content-Type is allowed');
    res.status(400).send(response);
    return;
  }

  next();
};

const apiErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  req.log?.error({ err }, 'Unhandled request error');

  if (
    err instanceof SyntaxError &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err as any).status === 400 &&
    'body' in err
  ) {
    res.status(400).json(unifiedResponse(false, 'Invalid JSON'));
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json(unifiedResponse(false, ERROR.BAD_REQUEST));
    return;
  }
  if (
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    res.status(400).json(unifiedResponse(false, ERROR.BAD_REQUEST));
    return;
  }
  res.status(500).json(unifiedResponse(false, ERROR.INTERNAL_SERVER_ERROR));
};

const unmatchedRoutes = (req: Request, res: Response): void => {
  req.log?.info({ method: req.method, url: req.originalUrl }, 'Unmatched route');
  res.status(404).json(unifiedResponse(false, ERROR.ROUTE_NOT_FOUND));
};

export { apiErrorHandler, checkContentType, unmatchedRoutes };
