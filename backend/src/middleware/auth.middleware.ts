import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { unifiedResponse } from 'uni-response';

import { env } from '../config/env-config';
import { PrismaService } from '../config/prisma.config';
import { ERROR } from '../constants/messages';

const secret: Secret = env.JWT_SECRET as string;

interface AuthPayload {
  workspaceId: string;
  deviceId: string;
}

declare global {
  namespace Express {
    interface Request {
      workspaceId?: string;
      deviceId?: string;
    }
  }
}

const verifyAccessToken = (token: string): AuthPayload | null => {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as AuthPayload;
    if (!decoded.workspaceId || !decoded.deviceId) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

export const findActiveDevice = async (workspaceId: string, deviceId: string): Promise<boolean> => {
  const device = await PrismaService.getInstance().client.device.findFirst({
    where: { id: deviceId, workspaceId, revokedAt: null },
    select: { id: true },
  });
  return Boolean(device);
};

class AuthService {
  private readAccessToken(req: Request): string | undefined {
    return req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice('Bearer '.length)
      : undefined;
  }

  public async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = this.readAccessToken(req);

    if (!token) {
      res.status(401).json(unifiedResponse(false, ERROR.UNAUTHORIZED));
      return;
    }

    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) {
      res.status(401).json(unifiedResponse(false, ERROR.UNAUTHORIZED));
      return;
    }

    const active = await findActiveDevice(decodedToken.workspaceId, decodedToken.deviceId);
    if (!active) {
      res.status(401).json(unifiedResponse(false, ERROR.UNAUTHORIZED));
      return;
    }

    req.workspaceId = decodedToken.workspaceId;
    req.deviceId = decodedToken.deviceId;
    next();
  }
}

const authService = new AuthService();

export const auth = authService.auth.bind(authService);
