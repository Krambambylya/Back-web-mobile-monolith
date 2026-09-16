import {
  bootstrapItemsSchema,
  manifestItemsSchema,
  pullItemsSchema,
  pushItemsSchema,
  upsertItemSchema,
} from '@pairkit/core/api';
import { Router } from 'express';

import { PrismaService } from '@/config/prisma.config';
import { WorkspaceRepository } from '@/features/user/repositories/workspace.repository';
import { auth } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validation.middleware';

import { ItemSyncController } from '../controllers/item-sync.controller';
import { ItemRepository } from '../repositories/item.repository';
import { ItemSyncService } from '../services/item-sync.service';

const prisma = PrismaService.getInstance().client;
const itemRepository = new ItemRepository(prisma);
const workspaceRepository = new WorkspaceRepository(prisma);
const itemSyncService = new ItemSyncService(itemRepository, workspaceRepository);
const itemSyncController = new ItemSyncController(itemSyncService);

const itemsRouter = Router();

itemsRouter.use(auth);

itemsRouter.get('/', itemSyncController.list);
itemsRouter.post('/', validateRequest(upsertItemSchema), itemSyncController.upsert);
itemsRouter.post('/bootstrap', validateRequest(bootstrapItemsSchema), itemSyncController.bootstrap);
itemsRouter.post('/manifest', validateRequest(manifestItemsSchema), itemSyncController.manifest);
itemsRouter.post('/pull', validateRequest(pullItemsSchema), itemSyncController.pull);
itemsRouter.post('/push', validateRequest(pushItemsSchema), itemSyncController.push);

export { itemsRouter };
