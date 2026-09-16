import type {
  BootstrapItemsEnvelope,
  CreateWorkspaceEnvelope,
  IssuePairingCodeEnvelope,
  Item,
  ItemEnvelope,
  ListItemsEnvelope,
  ManifestEnvelope,
  PullItemsEnvelope,
  PushItemsEnvelope,
  RefreshEnvelope,
  TokenPairEnvelope,
} from '../api';
import { unwrapEnvelope } from '../api/envelope';
import type { SyncApi, SyncSession } from '../sync-engine';

import { ApiRequestError, parseRetryAfterSec } from './errors';

type ApiErrorBody = {
  success?: boolean;
  message?: string;
};

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export type WorkspaceApiDeps = {
  getBaseUrl: () => string;
  getSession: () => Promise<Pick<SyncSession, 'accessToken' | 'refreshToken'>>;
  patchSession: (patch: Partial<SyncSession>) => Promise<unknown>;
  fetch?: typeof fetch;
};

export type WorkspaceApi = SyncApi<Item> & {
  listItems: () => Promise<{ items: Item[] }>;
  upsertItem: (item: Item) => Promise<{ item: Item }>;
  refreshTokens: () => Promise<boolean>;
};

export const createWorkspaceApi = (deps: WorkspaceApiDeps): WorkspaceApi => {
  const fetchImpl = deps.fetch ?? fetch;

  const request = async <T>(
    path: string,
    options: {
      method?: string;
      body?: unknown;
      auth?: boolean;
      retryOn401?: boolean;
    } = {},
  ): Promise<T> => {
    const base = deps.getBaseUrl().replace(/\/$/, '');
    if (!base) {
      throw new Error('API URL is not configured');
    }

    const headers: Record<string, string> = { ...jsonHeaders };
    if (options.auth !== false) {
      const session = await deps.getSession();
      if (session.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    const response = await fetchImpl(`${base}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    if (response.status === 401 && options.retryOn401 !== false && options.auth !== false) {
      const refreshed = await refreshTokens();
      if (refreshed) {
        return request<T>(path, { ...options, retryOn401: false });
      }
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorBody | null;
      const message =
        (payload && typeof payload === 'object' && payload.message) ||
        `Request failed (${response.status})`;
      throw new ApiRequestError(String(message), response.status, parseRetryAfterSec(response));
    }

    return (await response.json()) as T;
  };

  const refreshTokens = async (): Promise<boolean> => {
    const session = await deps.getSession();
    if (!session.refreshToken) return false;
    try {
      const result = await request<RefreshEnvelope>('/v1/workspaces/refresh', {
        method: 'POST',
        body: { refreshToken: session.refreshToken },
        auth: false,
        retryOn401: false,
      });
      if (!result.success || !result.data) return false;
      await deps.patchSession({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    refreshTokens,
    createWorkspace: async (deviceName: string) =>
      unwrapEnvelope(
        await request<CreateWorkspaceEnvelope>('/v1/workspaces/create', {
          method: 'POST',
          body: { deviceName },
          auth: false,
        }),
        'Could not create workspace',
      ),
    joinWorkspace: async (pairingCode: string, deviceName: string) =>
      unwrapEnvelope(
        await request<TokenPairEnvelope>('/v1/workspaces/join', {
          method: 'POST',
          body: { pairingCode, deviceName },
          auth: false,
        }),
        'Could not join workspace',
      ),
    recoverWorkspace: async (recoveryKey: string, deviceName: string) =>
      unwrapEnvelope(
        await request<TokenPairEnvelope>('/v1/workspaces/recover', {
          method: 'POST',
          body: { recoveryKey: recoveryKey.replace(/\s+/g, ''), deviceName },
          auth: false,
        }),
        'Could not recover workspace',
      ),
    issuePairingCode: async () =>
      request<IssuePairingCodeEnvelope>('/v1/workspaces/pairing-code', {
        method: 'POST',
        body: {},
      }),
    bootstrapItemsChunk: async (items: Item[], sentIds: string[]) =>
      request<BootstrapItemsEnvelope>('/v1/items/bootstrap', {
        method: 'POST',
        body: {
          items,
          cursor: { done: false, sentIds },
        },
      }),
    postManifest: async entries =>
      request<ManifestEnvelope>('/v1/items/manifest', {
        method: 'POST',
        body: { entries },
      }),
    pullItems: async ids =>
      request<PullItemsEnvelope>('/v1/items/pull', {
        method: 'POST',
        body: { ids },
      }),
    pushItems: async items =>
      request<PushItemsEnvelope>('/v1/items/push', {
        method: 'POST',
        body: { items },
      }),
    listItems: async () =>
      unwrapEnvelope(await request<ListItemsEnvelope>('/v1/items'), 'Could not list items'),
    upsertItem: async (item: Item) =>
      unwrapEnvelope(
        await request<ItemEnvelope>('/v1/items', {
          method: 'POST',
          body: item,
        }),
        'Could not save item',
      ),
  };
};
