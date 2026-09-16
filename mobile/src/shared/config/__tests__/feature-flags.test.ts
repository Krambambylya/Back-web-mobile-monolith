import { describe, expect, test } from 'vitest';

import { getApiBaseUrl, isMobileSyncEnabled } from '../feature-flags';

describe('getApiBaseUrl', () => {
  test('defaults to localhost:4000 when unset', () => {
    const previous = process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_API_URL;
    expect(getApiBaseUrl()).toBe('http://localhost:4000');
    if (previous === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = previous;
    }
  });
});

describe('isMobileSyncEnabled', () => {
  test('is off when __DEV__ is false and the env flag is unset', () => {
    const previousDev = (globalThis as unknown as { __DEV__?: boolean }).__DEV__;
    const previous = process.env.EXPO_PUBLIC_SYNC_ENABLED;
    (globalThis as unknown as { __DEV__: boolean }).__DEV__ = false;
    delete process.env.EXPO_PUBLIC_SYNC_ENABLED;
    expect(isMobileSyncEnabled()).toBe(false);
    if (previous === undefined) {
      delete process.env.EXPO_PUBLIC_SYNC_ENABLED;
    } else {
      process.env.EXPO_PUBLIC_SYNC_ENABLED = previous;
    }
    (globalThis as unknown as { __DEV__?: boolean }).__DEV__ = previousDev;
  });
});
