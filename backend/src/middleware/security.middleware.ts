import rateLimit from 'express-rate-limit';
import { unifiedResponse } from 'uni-response';

import { RATE_LIMIT } from '../constants/config.constants';

const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT.GLOBAL_WINDOW_MS,
  max: RATE_LIMIT.GLOBAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: unifiedResponse(false, 'Too many attempts, please try again later'),
});

export { authRateLimiter, rateLimiter };
