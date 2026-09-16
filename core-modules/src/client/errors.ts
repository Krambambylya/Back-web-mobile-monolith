export class ApiRequestError extends Error {
  readonly status: number;
  readonly retryAfterSec: number | null;

  constructor(message: string, status: number, retryAfterSec: number | null = null) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.retryAfterSec = retryAfterSec;
  }
}

const RATE_LIMIT_FALLBACK_SEC = 15 * 60;

export const isRateLimitError = (err: unknown): boolean => {
  if (err instanceof ApiRequestError && err.status === 429) return true;
  return err instanceof Error && /too many attempts/i.test(err.message);
};

export const rateLimitRetryAfterSec = (err: unknown): number => {
  if (err instanceof ApiRequestError && err.retryAfterSec != null && err.retryAfterSec > 0) {
    return err.retryAfterSec;
  }
  return RATE_LIMIT_FALLBACK_SEC;
};

export const parseRetryAfterSec = (response: Response): number | null => {
  const retryAfter = response.headers.get('Retry-After');
  if (!retryAfter) return null;
  const asNumber = Number(retryAfter);
  if (Number.isFinite(asNumber) && asNumber >= 0) return Math.ceil(asNumber);
  const asDate = Date.parse(retryAfter);
  if (!Number.isNaN(asDate)) return Math.max(0, Math.ceil((asDate - Date.now()) / 1000));
  return null;
};
