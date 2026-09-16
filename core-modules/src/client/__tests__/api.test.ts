import { describe, expect, test } from 'vitest';

import { createWorkspaceApi } from '../api';
import { ApiRequestError, isRateLimitError, rateLimitRetryAfterSec } from '../errors';
import { defaultWorkspaceSession, type WorkspaceSession } from '../session';

const jsonResponse = (body: unknown, init: { status?: number; headers?: HeadersInit } = {}) =>
  new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

describe('createWorkspaceApi', () => {
  test('unwraps create workspace and retries once after a 401 refresh', async () => {
    let session: WorkspaceSession = {
      ...defaultWorkspaceSession(),
      accessToken: 'expired',
      refreshToken: 'refresh-1',
      syncState: 'ready',
    };
    const calls: string[] = [];

    const api = createWorkspaceApi({
      getBaseUrl: () => 'http://api.test',
      getSession: async () => session,
      patchSession: async patch => {
        session = { ...session, ...patch };
      },
      fetch: async (input, init) => {
        const url = String(input);
        calls.push(`${init?.method ?? 'GET'} ${url}`);
        if (url.endsWith('/v1/workspaces/refresh')) {
          return jsonResponse({
            success: true,
            message: 'ok',
            data: { accessToken: 'next-access', refreshToken: 'next-refresh' },
          });
        }
        if (url.endsWith('/v1/items') && init?.method === 'GET') {
          const auth = new Headers(init.headers).get('Authorization');
          if (auth !== 'Bearer next-access') {
            return jsonResponse({ success: false, message: 'unauthorized' }, { status: 401 });
          }
          return jsonResponse({
            success: true,
            message: 'ok',
            data: { items: [] },
          });
        }
        throw new Error(`unexpected ${url}`);
      },
    });

    const listed = await api.listItems();
    expect(listed.items).toEqual([]);
    expect(session.accessToken).toBe('next-access');
    expect(calls).toEqual([
      'GET http://api.test/v1/items',
      'POST http://api.test/v1/workspaces/refresh',
      'GET http://api.test/v1/items',
    ]);
  });

  test('throws ApiRequestError with Retry-After on 429', async () => {
    const api = createWorkspaceApi({
      getBaseUrl: () => 'http://api.test',
      getSession: async () => defaultWorkspaceSession(),
      patchSession: async () => undefined,
      fetch: async () =>
        jsonResponse(
          { success: false, message: 'Too many attempts' },
          { status: 429, headers: { 'Retry-After': '30' } },
        ),
    });

    const error = await api.createWorkspace('web').catch(err => err);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(429);
    expect(error.retryAfterSec).toBe(30);
    expect(isRateLimitError(error)).toBe(true);
    expect(rateLimitRetryAfterSec(error)).toBe(30);
  });

  test('rejects an empty API base URL before fetching', async () => {
    const api = createWorkspaceApi({
      getBaseUrl: () => '',
      getSession: async () => defaultWorkspaceSession(),
      patchSession: async () => undefined,
      fetch: async () => {
        throw new Error('fetch should not run');
      },
    });

    await expect(api.createWorkspace('web')).rejects.toThrow('API URL is not configured');
  });
});
