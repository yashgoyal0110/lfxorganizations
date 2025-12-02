console.log('🔥 tracing.js LOADED');

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
require('dotenv').config();

// Use SigNoz Cloud ingestion endpoint
const traceExporter = new OTLPTraceExporter({
  url: `https://ingest.${process.env.SIGNOZ_REGION}.signoz.cloud:443/v1/traces`,
  headers: {
    'signoz-ingestion-key': process.env.SIGNOZ_INGESTION_KEY,
  },
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'express-api', // will show as service name in SigNoz
  }),
});
// start the SDK in this process
(async () => {
  try {
    sdk.start(); // works even if start() is sync; await just passes through
    console.log('✅ OpenTelemetry initialized for Express API');
  } catch (err) {
    console.error('❌ Error starting OpenTelemetry SDK', err);
  }
})();

process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing terminated');
  } catch (error) {
    console.log('Error terminating tracing', error);
  } finally {
    process.exit(0);
  }
});
