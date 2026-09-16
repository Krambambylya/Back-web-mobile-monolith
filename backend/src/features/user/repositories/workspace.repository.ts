import {
  CreateWorkspaceRepositoryInput,
  CreateWorkspaceRepositoryResult,
} from '@/features/user/types/workspace.types';
import { PrismaClient } from '@/generated/prisma/client';
import type { DbClient } from '@/types/db-client';

export class WorkspaceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createWorkspace(
    input: CreateWorkspaceRepositoryInput,
  ): Promise<CreateWorkspaceRepositoryResult> {
    const {
      pairingCodeHash,
      pairingCodeExpiresAt,
      recoveryKeyHash,
      deviceName,
      refreshTokenHash,
      refreshTokenExpiresAt,
    } = input;

    return this.prisma.$transaction(async tx => {
      const workspace = await tx.workspace.create({
        data: {
          recoveryKeyHash,
          devices: {
            create: { name: deviceName },
          },
          pairingCodes: {
            create: {
              codeHash: pairingCodeHash,
              expiresAt: pairingCodeExpiresAt,
            },
          },
        },
        include: { devices: true },
      });

      const device = workspace.devices[0];
      if (!device) {
        throw new Error('Workspace created without a device');
      }

      await tx.refreshToken.create({
        data: {
          tokenHash: refreshTokenHash,
          expiresAt: refreshTokenExpiresAt,
          workspaceId: workspace.id,
          deviceId: device.id,
        },
      });

      return { workspaceId: workspace.id, deviceId: device.id };
    });
  }

  async touchLastUsedAt(workspaceId: string, db: DbClient = this.prisma): Promise<void> {
    await db.workspace.update({
      where: { id: workspaceId },
      data: { lastUsedAt: new Date() },
    });
  }

  async findIdByRecoveryKeyHash(recoveryKeyHash: string): Promise<string | null> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { recoveryKeyHash },
      select: { id: true },
    });
    return workspace?.id ?? null;
  }
}
