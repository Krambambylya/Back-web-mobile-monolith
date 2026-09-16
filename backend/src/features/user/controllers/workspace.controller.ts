import { NextFunction, Request, Response } from 'express';
import { unifiedResponse } from 'uni-response';

import { ERROR } from '@/constants/messages';
import { WorkspaceService } from '@/features/user/services/workspace.service';

export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  createWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.workspaceService.createWorkspace(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  joinWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.workspaceService.joinWorkspace(req.body);
      if (!result) {
        res.status(400).json(unifiedResponse(false, ERROR.INVALID_PAIRING_CODE));
        return;
      }
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  recoverWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.workspaceService.recoverWorkspace(req.body);
      if (!result) {
        res.status(400).json(unifiedResponse(false, ERROR.INVALID_RECOVERY_KEY));
        return;
      }
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.workspaceService.refresh(req.body);
      if (!result.success) {
        res.status(401).json(result);
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  issuePairingCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = req.workspaceId;
      if (!workspaceId) {
        res.status(401).json(unifiedResponse(false, ERROR.UNAUTHORIZED));
        return;
      }
      const result = await this.workspaceService.issuePairingCode(workspaceId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
