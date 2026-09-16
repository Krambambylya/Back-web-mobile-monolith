import { NextFunction, Request, Response } from 'express';
import { unifiedResponse } from 'uni-response';

import { ERROR } from '@/constants/messages';

import { ItemSyncService } from '../services/item-sync.service';

export class ItemSyncController {
  constructor(private readonly itemSyncService: ItemSyncService) {}

  private workspaceId(req: Request, res: Response): string | null {
    if (!req.workspaceId) {
      res.status(401).json(unifiedResponse(false, ERROR.UNAUTHORIZED));
      return null;
    }
    return req.workspaceId;
  }

  private handleSyncError(error: unknown, res: Response, next: NextFunction) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const err = error as Error & { statusCode: number };
      res.status(err.statusCode).json(unifiedResponse(false, err.message));
      return;
    }
    next(error);
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = this.workspaceId(req, res);
      if (!workspaceId) return;
      const result = await this.itemSyncService.list(workspaceId);
      res.status(200).json(result);
    } catch (error) {
      this.handleSyncError(error, res, next);
    }
  };

  upsert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = this.workspaceId(req, res);
      if (!workspaceId) return;
      const result = await this.itemSyncService.upsert(workspaceId, req.body);
      res.status(200).json(result);
    } catch (error) {
      this.handleSyncError(error, res, next);
    }
  };

  bootstrap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = this.workspaceId(req, res);
      if (!workspaceId) return;
      const result = await this.itemSyncService.bootstrap(workspaceId, req.body);
      res.status(200).json(result);
    } catch (error) {
      this.handleSyncError(error, res, next);
    }
  };

  manifest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = this.workspaceId(req, res);
      if (!workspaceId) return;
      const result = await this.itemSyncService.manifest(workspaceId, req.body);
      res.status(200).json(result);
    } catch (error) {
      this.handleSyncError(error, res, next);
    }
  };

  pull = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = this.workspaceId(req, res);
      if (!workspaceId) return;
      const result = await this.itemSyncService.pull(workspaceId, req.body);
      res.status(200).json(result);
    } catch (error) {
      this.handleSyncError(error, res, next);
    }
  };

  push = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = this.workspaceId(req, res);
      if (!workspaceId) return;
      const result = await this.itemSyncService.push(workspaceId, req.body);
      res.status(200).json(result);
    } catch (error) {
      this.handleSyncError(error, res, next);
    }
  };
}
