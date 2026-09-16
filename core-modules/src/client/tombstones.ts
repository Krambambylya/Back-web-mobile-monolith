import type { ItemTombstone } from '../sync-engine';

import { STORAGE_KEYS } from './keys';
import { createJsonListStore, type JsonKvStore } from './kv';

export const createTombstoneStorage = (kv: JsonKvStore, ignoreWriteErrors = true) => {
  const store = createJsonListStore<ItemTombstone>({
    key: STORAGE_KEYS.tombstones,
    kv,
    ignoreWriteErrors,
  });

  const getTombstones = store.getAll;
  const writeTombstones = store.writeAll;

  const addTombstone = async (id: string): Promise<void> => {
    const now = new Date().toISOString();
    const next = (await getTombstones()).filter(tombstone => tombstone.id !== id);
    next.push({ id, deletedAt: now, updatedAt: now });
    await writeTombstones(next);
  };

  const removeTombstones = async (ids: string[]): Promise<void> => {
    if (!ids.length) return;
    const idSet = new Set(ids);
    await writeTombstones((await getTombstones()).filter(tombstone => !idSet.has(tombstone.id)));
  };

  const clearAllTombstones = async (): Promise<void> => {
    await writeTombstones([]);
  };

  return {
    getTombstones,
    addTombstone,
    removeTombstones,
    clearAllTombstones,
  };
};
