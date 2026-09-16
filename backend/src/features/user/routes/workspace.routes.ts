import {
  createWorkspaceSchema,
  joinWorkspaceSchema,
  recoverWorkspaceSchema,
  refreshWorkspaceSchema,
} from '@pairkit/core/api';
import { Router } from 'express';

import { PrismaService } from '@/config/prisma.config';
import { auth } from '@/middleware/auth.middleware';
import { authRateLimiter } from '@/middleware/security.middleware';
import { validateRequest } from '@/middleware/validation.middleware';

import { WorkspaceController } from '../controllers/workspace.controller';
import { DeviceRepository } from '../repositories/device.repository';
import { PairingCodeRepository } from '../repositories/pairing-code.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { WorkspaceService } from '../services/workspace.service';

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client;
const workspaceRepository = new WorkspaceRepository(prisma);
const pairingCodeRepository = new PairingCodeRepository(prisma);
const deviceRepository = new DeviceRepository(prisma);
const refreshTokenRepository = new RefreshTokenRepository(prisma);
const workspaceService = new WorkspaceService(
  prisma,
  workspaceRepository,
  pairingCodeRepository,
  deviceRepository,
  refreshTokenRepository,
);
const workspaceController = new WorkspaceController(workspaceService);

const workspaceRouter = Router();

workspaceRouter.post(
  '/create',
  authRateLimiter,
  validateRequest(createWorkspaceSchema),
  workspaceController.createWorkspace,
);
workspaceRouter.post(
  '/join',
  authRateLimiter,
  validateRequest(joinWorkspaceSchema),
  workspaceController.joinWorkspace,
);
workspaceRouter.post(
  '/recover',
  authRateLimiter,
  validateRequest(recoverWorkspaceSchema),
  workspaceController.recoverWorkspace,
);
workspaceRouter.post(
  '/refresh',
  authRateLimiter,
  validateRequest(refreshWorkspaceSchema),
  workspaceController.refresh,
);
workspaceRouter.post('/pairing-code', auth, authRateLimiter, workspaceController.issuePairingCode);

export { workspaceRouter };
