import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { validateEnv } from './shared/config/env.js';
import { connectDB, disconnectDB } from './shared/config/db.js';

const env = validateEnv();

const PORT = env.PORT;

async function start() {
  await connectDB();

  const { createApp } = await import('./app.js');
  const { app, logger } = createApp(env);

  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT} (${env.NODE_ENV})`);
  });

  // ---- Graceful shutdown ----
  function shutdown(signal: string) {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit after 10s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
