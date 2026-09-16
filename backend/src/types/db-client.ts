import type { PrismaClient } from '@/generated/prisma/client';

/** Prisma client or interactive-transaction client (model delegates only). */
export type DbClient = Pick<
  PrismaClient,
  'workspace' | 'device' | 'refreshToken' | 'pairingCode' | 'item'
>;
