import type { SyncSession, SyncState } from '../sync-engine';

export type WorkspaceSession = SyncSession;

export const defaultWorkspaceSession = (): WorkspaceSession => ({
  workspaceId: null,
  accessToken: null,
  refreshToken: null,
  syncState: 'off',
  pendingPairingCode: null,
  pendingPairingExpiresAt: null,
  pendingRecoveryKey: null,
  lastSyncedAt: null,
});

export const normalizeStoredSession = (raw: unknown): WorkspaceSession => {
  if (!raw || typeof raw !== 'object') return defaultWorkspaceSession();
  const obj = raw as Record<string, unknown>;
  const accessToken = typeof obj.accessToken === 'string' ? obj.accessToken : null;
  const refreshToken = typeof obj.refreshToken === 'string' ? obj.refreshToken : null;
  const hasTokens = Boolean(accessToken && refreshToken);

  let syncState: SyncState = 'off';
  if (obj.syncState === 'needsBootstrap' || obj.syncState === 'ready' || obj.syncState === 'off') {
    syncState = obj.syncState;
  } else if (hasTokens) {
    syncState = 'needsBootstrap';
  }

  return {
    workspaceId:
      typeof obj.workspaceId === 'string' ? obj.workspaceId : hasTokens ? 'active' : null,
    accessToken,
    refreshToken,
    syncState,
    pendingPairingCode: typeof obj.pendingPairingCode === 'string' ? obj.pendingPairingCode : null,
    pendingPairingExpiresAt:
      typeof obj.pendingPairingExpiresAt === 'string' ? obj.pendingPairingExpiresAt : null,
    pendingRecoveryKey: typeof obj.pendingRecoveryKey === 'string' ? obj.pendingRecoveryKey : null,
    lastSyncedAt: typeof obj.lastSyncedAt === 'string' ? obj.lastSyncedAt : null,
  };
};

const isThenable = (value: unknown): value is Promise<unknown> =>
  typeof value === 'object' && value !== null && 'then' in value;

export type SessionPersistence = {
  read: () => unknown | Promise<unknown>;
  write: (session: WorkspaceSession) => void | Promise<void>;
};

export const createSessionStore = (persistence: SessionPersistence) => {
  let memory: WorkspaceSession | null = null;
  const listeners = new Set<() => void>();

  const emit = () => {
    listeners.forEach(listener => listener());
  };

  const subscribe = (onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  };

  const getSnapshot = (): WorkspaceSession => {
    if (memory) return memory;
    const raw = persistence.read();
    if (isThenable(raw)) return defaultWorkspaceSession();
    memory = normalizeStoredSession(raw);
    return memory;
  };

  const get = async (): Promise<WorkspaceSession> => {
    if (memory) return memory;
    const raw = await persistence.read();
    memory = normalizeStoredSession(raw);
    return memory;
  };

  const write = async (session: WorkspaceSession): Promise<void> => {
    await persistence.write(session);
    memory = session;
    emit();
  };

  const patch = async (partial: Partial<WorkspaceSession>): Promise<WorkspaceSession> => {
    const next = { ...(await get()), ...partial };
    await write(next);
    return next;
  };

  const clear = async (): Promise<void> => {
    await write(defaultWorkspaceSession());
  };

  return { subscribe, getSnapshot, get, write, patch, clear };
};
