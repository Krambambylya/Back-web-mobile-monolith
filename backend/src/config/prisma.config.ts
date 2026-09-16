import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, type PoolConfig } from 'pg';

import { PrismaClient } from '@/generated/prisma/client';

import { env } from './env-config';

const sslFromUrl = (connectionString: string): PoolConfig['ssl'] => {
  try {
    const sslMode = new URL(connectionString).searchParams.get('sslmode');
    if (sslMode === 'require' || sslMode === 'verify-full' || sslMode === 'verify-ca') {
      return { rejectUnauthorized: true };
    }
  } catch {
    return undefined;
  }
  return undefined;
};

export class PrismaService {
  private static instance: PrismaService | null = null;
  private prismaClient: PrismaClient;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: env.DATABASE_POOL_MAX ?? 10,
      ssl: sslFromUrl(env.DATABASE_URL),
    });
    const adapter = new PrismaPg(this.pool);
    this.prismaClient = new PrismaClient({ adapter });
  }

  public static getInstance(): PrismaService {
    if (!this.instance) {
      this.instance = new PrismaService();
    }
    return this.instance;
  }

  public get client(): PrismaClient {
    return this.prismaClient;
  }

  public async disconnect(): Promise<void> {
    await this.prismaClient.$disconnect();
    await this.pool.end();
  }
}
