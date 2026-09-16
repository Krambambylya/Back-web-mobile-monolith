import { describe, expect, test } from 'vitest';

import { createSessionStore, defaultWorkspaceSession, normalizeStoredSession } from '../session';

describe('normalizeStoredSession', () => {
  test('treats token-only records as needsBootstrap', () => {
    const session = normalizeStoredSession({
      accessToken: 'a',
      refreshToken: 'b',
    });
    expect(session.syncState).toBe('needsBootstrap');
    expect(session.workspaceId).toBe('active');
  });

  test('returns the default session for garbage input', () => {
    expect(normalizeStoredSession(null).syncState).toBe('off');
    expect(normalizeStoredSession('nope').accessToken).toBeNull();
  });
});

describe('createSessionStore', () => {
  test('patches, writes, and clears through persistence', async () => {
    let persisted: unknown = null;
    const store = createSessionStore({
      read: () => persisted,
      write: session => {
        persisted = session;
      },
    });

    await store.patch({ accessToken: 'a', refreshToken: 'b', syncState: 'ready' });
    expect(store.getSnapshot().accessToken).toBe('a');
    expect(persisted).toMatchObject({ accessToken: 'a', syncState: 'ready' });

    await store.clear();
    expect(store.getSnapshot()).toEqual(defaultWorkspaceSession());
  });

  test('does not update memory when persistence write fails', async () => {
    const store = createSessionStore({
      read: () => null,
      write: () => {
        throw new Error('quota');
      },
    });

    await expect(
      store.write({
        ...defaultWorkspaceSession(),
        accessToken: 'a',
        refreshToken: 'b',
        syncState: 'ready',
      }),
    ).rejects.toThrow('quota');
    expect(store.getSnapshot().syncState).toBe('off');
  });
});
