import { z } from 'zod';

export const envSchema = z
  .object({
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:4000'),
    NEXT_PUBLIC_SITE_URL: z.string().url().default('https://example.com'),
    NEXT_PUBLIC_SYNC_WEB_ENABLED: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV === 'production' && value.NEXT_PUBLIC_SITE_URL === 'https://example.com') {
      ctx.addIssue({
        code: 'custom',
        path: ['NEXT_PUBLIC_SITE_URL'],
        message: 'Set NEXT_PUBLIC_SITE_URL to the public origin before a production build',
      });
    }
  });

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SYNC_WEB_ENABLED: process.env.NEXT_PUBLIC_SYNC_WEB_ENABLED,
  NODE_ENV: process.env.NODE_ENV,
});
