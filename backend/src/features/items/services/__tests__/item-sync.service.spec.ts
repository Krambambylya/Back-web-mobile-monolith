import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ItemSyncService } from '../item-sync.service';

const itemRepository = {
  findGlobalById: vi.fn(),
  countLive: vi.fn(),
  upsertSavedItem: vi.fn(),
  listManifest: vi.fn(),
  findByIds: vi.fn(),
  listLive: vi.fn(),
  toDto: vi.fn(row => row),
};

const workspaceRepository = {
  touchLastUsedAt: vi.fn(),
};

const item = {
  id: 'item-1',
  title: 'Hello',
  body: 'World',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('ItemSyncService', () => {
  let service: ItemSyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ItemSyncService(itemRepository as never, workspaceRepository as never);
  });

  it('manifest asks the client to pull server-only live rows', async () => {
    itemRepository.listManifest.mockResolvedValue([
      { id: 'a', updatedAt: new Date('2024-02-01T00:00:00.000Z'), deletedAt: null },
    ]);

    const result = await service.manifest('ws-1', { entries: [] });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ pull: ['a'], pushNeeded: [], tombstones: [] });
  });

  it('manifest asks the client to push ids the server does not have', async () => {
    itemRepository.listManifest.mockResolvedValue([]);

    const result = await service.manifest('ws-1', {
      entries: [{ id: 'b', updatedAt: '2024-02-01T00:00:00.000Z', deletedAt: null }],
    });

    expect(result.data).toEqual({ pull: [], pushNeeded: ['b'], tombstones: [] });
  });

  it('rejects an item that belongs to another workspace', async () => {
    itemRepository.findGlobalById.mockResolvedValue({
      id: 'item-1',
      workspaceId: 'other',
      updatedAt: new Date(),
      deletedAt: null,
    });

    await expect(service.upsert('ws-1', item)).rejects.toMatchObject({ statusCode: 403 });
  });
});
