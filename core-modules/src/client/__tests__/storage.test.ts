import { describe, expect, test } from 'vitest';

import { createItemsStorage } from '../items-storage';
import { createMemoryKv } from '../kv';
import { createTombstoneStorage } from '../tombstones';

const item = {
  id: 'a',
  title: 'Note',
  body: '',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('createItemsStorage', () => {
  test('upserts by id and keeps the newest row first', async () => {
    const storage = createItemsStorage(createMemoryKv());
    await storage.upsertLocalItem(item);
    await storage.upsertLocalItem({ ...item, title: 'Updated' });
    const items = await storage.getSavedItems();
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Updated');
  });
});

describe('createTombstoneStorage', () => {
  test('adds, removes, and clears tombstones', async () => {
    const storage = createTombstoneStorage(createMemoryKv());
    await storage.addTombstone('a');
    await storage.addTombstone('b');
    expect(await storage.getTombstones()).toHaveLength(2);
    await storage.removeTombstones(['a']);
    expect((await storage.getTombstones()).map(row => row.id)).toEqual(['b']);
    await storage.clearAllTombstones();
    expect(await storage.getTombstones()).toEqual([]);
  });
});
