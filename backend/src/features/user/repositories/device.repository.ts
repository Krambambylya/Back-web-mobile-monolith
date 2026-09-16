import { PrismaClient } from '@/generated/prisma/client';
import type { DbClient } from '@/types/db-client';

export class DeviceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async joinDevice(
    workspaceId: string,
    deviceName: string,
    db: DbClient = this.prisma,
  ): Promise<{ deviceId: string }> {
    const device = await db.device.create({
      data: {
        workspaceId,
        name: deviceName,
      },
    });
    return { deviceId: device.id };
  }

  async findActive(
    workspaceId: string,
    deviceId: string,
    db: DbClient = this.prisma,
  ): Promise<{ id: string } | null> {
    return db.device.findFirst({
      where: { id: deviceId, workspaceId, revokedAt: null },
      select: { id: true },
    });
  }

  async revoke(deviceId: string, db: DbClient = this.prisma): Promise<void> {
    await db.device.update({
      where: { id: deviceId },
      data: { revokedAt: new Date() },
    });
  }
}
