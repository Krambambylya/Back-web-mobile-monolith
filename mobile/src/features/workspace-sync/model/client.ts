import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPairkitClient, type JsonKvStore } from '@pairkit/core/client';
import { Platform } from 'react-native';

import { getApiBaseUrl } from '@/shared/config/feature-flags';

import {
  clearWorkspaceSession,
  getWorkspaceSession,
  patchWorkspaceSession,
} from './session-storage';

const kv: JsonKvStore = {
  getItem: key => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
};

const deviceName = Platform.select({
  ios: 'Pairkit iOS',
  android: 'Pairkit Android',
  default: 'Pairkit Mobile',
}) as string;

const client = createPairkitClient({
  deviceName,
  getBaseUrl: getApiBaseUrl,
  kv,
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
