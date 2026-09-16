import type { Item } from '../api/item';

import { STORAGE_KEYS } from './keys';
import { createJsonListStore, type JsonKvStore } from './kv';

export const createItemsStorage = (kv: JsonKvStore, ignoreWriteErrors = true) => {
  const store = createJsonListStore<Item>({
    key: STORAGE_KEYS.items,
    kv,
    ignoreWriteErrors,
  });

  const getSavedItems = store.getAll;
  const writeItems = store.writeAll;

  const upsertLocalItem = async (item: Item): Promise<Item[]> => {
    const next = (await getSavedItems()).filter(row => row.id !== item.id);
    next.unshift(item);
    await writeItems(next);
    return next;
  };

  return { getSavedItems, writeItems, upsertLocalItem };
};
