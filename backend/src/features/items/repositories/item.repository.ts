import type { Item } from '@pairkit/core/api';

import { PrismaClient } from '@/generated/prisma/client';

type ItemRow = {
  id: string;
  workspaceId: string;
  title: string;
  body: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class ItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  toDto(row: ItemRow): Item {
    return {
      id: row.id,
      title: row.title,
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
    };
  }

  async countLive(workspaceId: string): Promise<number> {
    return this.prisma.item.count({
      where: { workspaceId, deletedAt: null },
    });
  }

  async findByIds(workspaceId: string, ids: string[]) {
    return this.prisma.item.findMany({
      where: { workspaceId, id: { in: ids } },
    });
  }

  async findGlobalById(id: string) {
    return this.prisma.item.findUnique({
      where: { id },
      select: { id: true, workspaceId: true, updatedAt: true, deletedAt: true },
    });
  }

  async listLive(workspaceId: string) {
    return this.prisma.item.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async listManifest(workspaceId: string) {
    return this.prisma.item.findMany({
      where: { workspaceId },
      select: {
        id: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async upsertSavedItem(workspaceId: string, item: Item) {
    const createdAt = new Date(item.createdAt);
    const updatedAt = new Date(item.updatedAt);
    const deletedAt = item.deletedAt ? new Date(item.deletedAt) : null;

    return this.prisma.item.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        workspaceId,
        title: item.title,
        body: item.body,
        deletedAt,
        createdAt,
        updatedAt,
      },
      update: {
        title: item.title,
        body: item.body,
        deletedAt,
        updatedAt,
      },
    });
  }
}
