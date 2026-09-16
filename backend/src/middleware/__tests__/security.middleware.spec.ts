import { describe, expect, it } from 'vitest';

import { authRateLimiter, rateLimiter } from '../security.middleware';

describe('security middleware', () => {
  it('exposes configured rate limiter middlewares', () => {
    expect(typeof rateLimiter).toBe('function');
    expect(typeof authRateLimiter).toBe('function');
  });
});
