import { Server as HttpServer } from 'http';

import { app } from './app';
import { env } from './config/env-config';
import { PrismaService } from './config/prisma.config';
import { RefreshTokenRepository } from './features/user/repositories/refresh-token.repository';
import { logger } from './middleware/pino-logger';
import { startTracing } from './observability/tracing';

const SHUTDOWN_TIMEOUT_MS = 10000;
const REFRESH_CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;

class Server {
  private readonly port: number;
  private serverInstance: HttpServer | undefined;
  private readonly prisma: PrismaService;
  private cleanupTimer: NodeJS.Timeout | undefined;

  constructor(port: number) {
    this.port = port;
    this.prisma = PrismaService.getInstance();
  }

  public start(): void {
    void startTracing();
    this.serverInstance = app.listen(this.port, () => {
      logger.info(`Server running at http://localhost:${this.port}`);
    });
    this.serverInstance.headersTimeout = 30_000;
    this.startRefreshCleanup();

    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('uncaughtException', this.handleUncaughtException.bind(this));
    process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
  }

  private startRefreshCleanup(): void {
    const repository = new RefreshTokenRepository(this.prisma.client);
    const run = () => {
      void repository.deleteExpired().then(
        count => {
          if (count > 0) {
            logger.info({ count }, 'Purged expired refresh tokens');
          }
        },
        (err: unknown) => {
          logger.error({ err }, 'Refresh token cleanup failed');
        },
      );
    };
    run();
    this.cleanupTimer = setInterval(run, REFRESH_CLEANUP_INTERVAL_MS);
    this.cleanupTimer.unref();
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Received shutdown signal, shutting down gracefully...');
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    try {
      this.serverInstance?.close(async () => {
        logger.info('No new requests are being accepted.');

        try {
          await this.closeDBConnection();
          logger.info('All connections closed, shutting down...');
          process.exit(0);
        } catch (err) {
          logger.error({ err }, 'Error during shutdown');
          process.exit(1);
        }
      });

      this.serverInstance?.closeAllConnections();

      setTimeout(() => {
        logger.error('Forcing shutdown due to timeout.');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT_MS).unref();
    } catch (err) {
      logger.error({ err }, 'Failed to initiate graceful shutdown');
      process.exit(1);
    }
  }

  private async closeDBConnection(): Promise<void> {
    logger.info('Closing database connection...');
    try {
      await this.prisma.disconnect();
      logger.info('Database connection closed.');
    } catch (err) {
      logger.error({ err }, 'Error closing database connection');
      throw err;
    }
  }

  private handleUncaughtException(error: Error): void {
    logger.error({ err: error }, 'Uncaught Exception');
    process.exit(1);
  }

  private handleUnhandledRejection(reason: unknown): void {
    logger.error({ reason }, 'Unhandled Rejection');
    process.exit(1);
  }
}

const server = new Server(env.PORT);
server.start();
