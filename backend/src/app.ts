import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { unifiedResponse } from 'uni-response';

import { PrismaService } from '@/config/prisma.config';
import { itemsRouter } from '@/features/items/routes/items.routes';
import { workspaceRouter } from '@/features/user/routes/workspace.routes';

import { env } from './config/env-config';
import { ITEMS_JSON_BODY_LIMIT } from './constants/config.constants';
import { ERROR, SUCCESS } from './constants/messages';
import {
  apiErrorHandler,
  checkContentType,
  unmatchedRoutes,
} from './middleware/api-error.middleware';
import { pinoLogger } from './middleware/pino-logger';
import { rateLimiter } from './middleware/security.middleware';

const app: Application = express();

const allowedURLs = env.WHITE_LIST_URLS || [];

if (env.TRUST_PROXY != null) {
  app.set('trust proxy', env.TRUST_PROXY);
}

app.use(pinoLogger);
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!res.headersSent) {
    res.setHeader('X-Request-Id', String(req.id));
  }
  next();
});
app.use(rateLimiter);
app.use(helmet());
app.use(express.json({ limit: ITEMS_JSON_BODY_LIMIT }));
app.use(
  cors({
    origin: allowedURLs,
    credentials: true,
    exposedHeaders: [
      'Retry-After',
      'RateLimit',
      'RateLimit-Reset',
      'RateLimit-Policy',
      'X-Request-Id',
    ],
  }),
);

const pingDatabase = async (): Promise<boolean> => {
  try {
    await PrismaService.getInstance().client.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

app.get('/', (_req: Request, res: Response): void => {
  res.json(unifiedResponse(true, SUCCESS.OK));
});

app.get('/live', (_req: Request, res: Response): void => {
  res.status(200).json(unifiedResponse(true, SUCCESS.OK, { status: 'ok' }));
});

const readyHandler = async (req: Request, res: Response): Promise<void> => {
  const dbOk = await pingDatabase();
  if (dbOk) {
    req.log.info('Health ok');
    res.status(200).json(unifiedResponse(true, SUCCESS.OK, { status: 'ok', db: 'ok' }));
    return;
  }
  req.log.error('Health database ping failed');
  res
    .status(503)
    .json(unifiedResponse(false, ERROR.DATABASE_UNAVAILABLE, { status: 'degraded', db: 'error' }));
};

app.get('/ready', readyHandler);
app.get('/health', readyHandler);

app.use('/v1', (req: Request, res: Response, next: NextFunction) => {
  checkContentType(req, res, next);
});
app.use('/v1/workspaces', workspaceRouter);
app.use('/v1/items', itemsRouter);

app.use(apiErrorHandler);
app.use(unmatchedRoutes);

export { app };
