import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SyncState } from '@pairkit/core';
import { createSessionStore, type WorkspaceSession } from '@pairkit/core/client';
import * as SecureStore from 'expo-secure-store';

export type { SyncState, WorkspaceSession };

type SessionMeta = {
  workspaceId: string | null;
  syncState: SyncState;
  pendingPairingCode?: string | null;
  pendingPairingExpiresAt?: string | null;
  lastSyncedAt?: string | null;
};

type SessionSecrets = {
  accessToken: string | null;
  refreshToken: string | null;
  pendingRecoveryKey?: string | null;
};

const META_KEY = 'pairkit.workspace-session-meta.v1';
const SECURE_ACCESS_KEY = 'pairkit.workspace.accessToken.v1';
const SECURE_REFRESH_KEY = 'pairkit.workspace.refreshToken.v1';
const SECURE_RECOVERY_KEY = 'pairkit.workspace.recoveryKey.v1';

const secureSet = async (key: string, value: string | null) => {
  if (value == null || value === '') {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const readSecrets = async (): Promise<SessionSecrets> => ({
  accessToken: await SecureStore.getItemAsync(SECURE_ACCESS_KEY),
  refreshToken: await SecureStore.getItemAsync(SECURE_REFRESH_KEY),
  pendingRecoveryKey: await SecureStore.getItemAsync(SECURE_RECOVERY_KEY),
});

const writeSecrets = async (secrets: SessionSecrets): Promise<void> => {
  await Promise.all([
    secureSet(SECURE_ACCESS_KEY, secrets.accessToken),
    secureSet(SECURE_REFRESH_KEY, secrets.refreshToken),
    secureSet(SECURE_RECOVERY_KEY, secrets.pendingRecoveryKey ?? null),
  ]);
};

const writeMeta = async (meta: SessionMeta): Promise<void> => {
  await AsyncStorage.setItem(META_KEY, JSON.stringify(meta));
};

const readMeta = async (): Promise<SessionMeta | null> => {
  const raw = await AsyncStorage.getItem(META_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as SessionMeta;
};

const store = createSessionStore({
  read: async () => {
    const [meta, secrets] = await Promise.all([readMeta(), readSecrets()]);
    if (!meta && !secrets.accessToken && !secrets.refreshToken) return null;
    return { ...(meta ?? {}), ...secrets };
  },
  write: async session => {
    try {
      await Promise.all([
        writeMeta({
          workspaceId: session.workspaceId,
          syncState: session.syncState,
          pendingPairingCode: session.pendingPairingCode ?? null,
          pendingPairingExpiresAt: session.pendingPairingExpiresAt ?? null,
          lastSyncedAt: session.lastSyncedAt ?? null,
        }),
        writeSecrets({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          pendingRecoveryKey: session.pendingRecoveryKey ?? null,
        }),
      ]);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Could not persist workspace session');
    }
  },
});

export const getWorkspaceSession = store.get;
export const writeWorkspaceSession = store.write;
export const patchWorkspaceSession = store.patch;
export const clearWorkspaceSession = store.clear;
