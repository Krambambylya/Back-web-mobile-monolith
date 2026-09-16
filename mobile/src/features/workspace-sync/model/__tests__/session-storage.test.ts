import { beforeEach, describe, expect, it, vi } from 'vitest';

const setItemAsync = vi.fn();
const getItemAsync = vi.fn();
const deleteItemAsync = vi.fn();
const asyncSetItem = vi.fn();
const asyncGetItem = vi.fn();

vi.mock('expo-secure-store', () => ({
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: asyncSetItem,
    getItem: asyncGetItem,
  },
}));

describe('writeWorkspaceSession', () => {
  beforeEach(() => {
    vi.resetModules();
    setItemAsync.mockReset();
    getItemAsync.mockReset();
    deleteItemAsync.mockReset();
    asyncSetItem.mockReset();
    asyncGetItem.mockReset();
    getItemAsync.mockResolvedValue(null);
    asyncGetItem.mockResolvedValue(null);
    deleteItemAsync.mockResolvedValue(undefined);
    asyncSetItem.mockResolvedValue(undefined);
  });

  it('propagates SecureStore write failures', async () => {
    setItemAsync.mockRejectedValue(new Error('secure store locked'));
    const { writeWorkspaceSession } = await import('../session-storage');

    await expect(
      writeWorkspaceSession({
        workspaceId: 'ws-1',
        accessToken: 'access',
        refreshToken: 'refresh',
        syncState: 'ready',
      }),
    ).rejects.toThrow('secure store locked');
  });

  it('propagates SecureStore read failures instead of looking signed out', async () => {
    getItemAsync.mockRejectedValue(new Error('secure store unavailable'));
    const { getWorkspaceSession } = await import('../session-storage');

    await expect(getWorkspaceSession()).rejects.toThrow('secure store unavailable');
  });
});
