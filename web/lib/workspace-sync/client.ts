import { createPairkitClient, type JsonKvStore } from '@pairkit/core/client';

import { env } from '@/lib/env';

import { clearWorkspaceSession, getWorkspaceSession, patchWorkspaceSession } from './session';

const createWebKv = (): JsonKvStore => ({
  getItem: key => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
});

const client = createPairkitClient({
  deviceName: 'Pairkit Web',
  getBaseUrl: () => env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''),
  kv: createWebKv(),
  session: {
    getSession: getWorkspaceSession,
    patchSession: patchWorkspaceSession,
    clearSession: clearWorkspaceSession,
  },
});

export const enableSyncByCreate = client.enableSyncByCreate;
export const enableSyncByJoin = client.enableSyncByJoin;
export const enableSyncByRecover = client.enableSyncByRecover;
export const disableSyncLocally = client.disableSyncLocally;
export const refreshPairingCode = client.refreshPairingCode;
export const recordLocalItemDeleted = client.recordLocalItemDeleted;
export const runBootstrap = client.runBootstrap;
export const runIncrementalSync = client.runIncrementalSync;
export const runSyncExclusive = client.runSyncExclusive;
export const scheduleSyncAfterLocalChange = client.scheduleSyncAfterLocalChange;
export const listItems = client.listItems;
export const upsertItem = client.upsertItem;
export const getSavedItems = client.getSavedItems;
export const upsertLocalItem = client.upsertLocalItem;
