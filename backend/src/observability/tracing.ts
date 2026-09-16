import { env } from '../config/env-config';
import { logger } from '../middleware/pino-logger';

export async function startTracing(): Promise<void> {
  const endpoint = env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint) {
    return;
  }

  try {
    const [{ NodeSDK }, { getNodeAutoInstrumentations }, { OTLPTraceExporter }] = await Promise.all(
      [
        import('@opentelemetry/sdk-node'),
        import('@opentelemetry/auto-instrumentations-node'),
        import('@opentelemetry/exporter-trace-otlp-http'),
      ],
    );

    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({
        url: `${endpoint.replace(/\/$/, '')}/v1/traces`,
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    await sdk.start();
    logger.info({ endpoint }, 'OpenTelemetry tracing enabled');
  } catch (err) {
    logger.warn({ err }, 'OpenTelemetry failed to start');
  }
}
