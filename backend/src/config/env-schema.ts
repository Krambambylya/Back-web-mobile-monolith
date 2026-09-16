import { z } from 'zod';

import {
  DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
  DEFAULT_REFRESH_TOKEN_EXPIRES_IN,
} from '../constants/config.constants';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  SHADOW_DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default(DEFAULT_ACCESS_TOKEN_EXPIRES_IN),
  JWT_REFRESH_EXPIRES_IN: z.string().default(DEFAULT_REFRESH_TOKEN_EXPIRES_IN),
  WHITE_LIST_URLS: z
    .string()
    .transform(value => value.split(',').map(url => url.trim()))
    .refine(urls => urls.every(url => z.string().url().safeParse(url).success), {
      message: 'Each value in WHITE_LIST_URLS must be a valid URL',
    }),
  TRUST_PROXY: z.coerce.number().int().min(0).optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).optional(),
});

export type EnvVars = z.infer<typeof envSchema>;
