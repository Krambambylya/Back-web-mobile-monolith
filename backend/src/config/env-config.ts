import dotenv from 'dotenv';
import fs from 'fs';

import { envSchema, EnvVars } from './env-schema';

// NOTE: this module intentionally uses `console` rather than the Pino logger — it runs
// before env vars (including LOG_LEVEL/NODE_ENV, which the logger itself is configured
// from) have been loaded and validated, so a structured logger isn't available yet.

// Local file is `.env.dev`; production/test use `.env.production` / `.env.test`.
// Falls back to `.env` so a clean clone can copy `.env.example` without renaming.
// eslint-disable-next-line node/no-process-env
const nodeEnv = process.env.NODE_ENV || 'development';
const preferredFile =
  nodeEnv === 'production' ? '.env.production' : nodeEnv === 'test' ? '.env.test' : '.env.dev';
const envFile = fs.existsSync(preferredFile)
  ? preferredFile
  : fs.existsSync('.env')
    ? '.env'
    : preferredFile;

let declaredEnvKeys: string[] = [];

if (fs.existsSync(envFile)) {
  const fileContents = fs.readFileSync(envFile);
  declaredEnvKeys = Object.keys(dotenv.parse(fileContents));
  dotenv.config({ path: envFile });
  // eslint-disable-next-line node/no-process-env
  console.log(`✅ Loaded environment: ${envFile}\nNODE_ENV: ${process.env.NODE_ENV}`);
} else {
  console.warn(`⚠️ Warning: Environment file "${envFile}" not found. Using process env.`);
}

// eslint-disable-next-line node/no-process-env
const parsedEnv = envSchema.safeParse(process.env);
// eslint-disable-next-line node/no-process-env
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.format();
  const missingKeys = Object.keys(formattedErrors).filter(key => key !== '_errors');

  console.error(
    `❌ Missing/invalid environment variables in "${NODE_ENV}" .env file:\n${missingKeys.join(', ')}`,
  );
  process.exit(1);
}

export const env: EnvVars = parsedEnv.data;

const allowedKeys = Object.keys(envSchema.shape);
const extraKeys = declaredEnvKeys.filter(key => !allowedKeys.includes(key));

if (extraKeys.length > 0) {
  console.warn(`⚠️ Warning: Unused environment variables detected: ${extraKeys.join(', ')}`);
}
