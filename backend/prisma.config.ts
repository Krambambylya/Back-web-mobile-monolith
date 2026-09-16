import dotenv from 'dotenv';
import fs from 'fs';
import { defineConfig } from 'prisma/config';

// Match backend/src/config/env-config.ts: local file is `.env.dev`, then `.env`.
// eslint-disable-next-line node/no-process-env -- CLI config runs outside the app env module
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile =
  nodeEnv === 'production' ? '.env.production' : nodeEnv === 'test' ? '.env.test' : '.env.dev';

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

// eslint-disable-next-line node/no-process-env -- Prisma CLI reads process.env directly
const databaseUrl =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  'postgresql://pairkit:pairkit@localhost:5432/pairkit';
// eslint-disable-next-line node/no-process-env
const shadowDatabaseUrl = process.env.SHADOW_DATABASE_URL;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
    ...(shadowDatabaseUrl ? { shadowDatabaseUrl } : {}),
  },
});
