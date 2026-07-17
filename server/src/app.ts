import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createRequire } from 'node:module';
import type { RequestHandler } from 'express';

const require = createRequire(import.meta.url);

const helmet = require('helmet') as (options?: Record<string, unknown>) => RequestHandler;
const rateLimit = require('express-rate-limit') as (options?: Record<string, unknown>) => RequestHandler;
import pino from 'pino';
import authRoutes from './features/auth/auth.routes.js';
import deliveriesRoutes from './features/deliveries/deliveries.routes.js';
import routesRoutes from './features/routes/routes.router.js';
import metricsRoutes from './features/metrics/metrics.routes.js';
import clientsRoutes from './features/clients/clients.router.js';
import fiadosRoutes from './features/fiados/fiados.routes.js';
import { Env } from './shared/config/env.js';

export function createApp(env: Env) {
  const app = express();

  // ---- Logger ----
  const logger = pino({
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    ...(env.NODE_ENV !== 'production' && {
      transport: { target: 'pino-pretty', options: { colorize: true } },
    }),
  });

  // Attach logger to app for downstream middleware/routes
  app.set('logger', logger);

  // ---- Security headers ----
  app.use(helmet());

  // ---- Rate limiting (API only) ----
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env.NODE_ENV === 'production' ? 100 : 10_000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' },
  });

  // ---- CORS ----
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // ---- Body parsing ----
  app.use(express.json());
  app.use(cookieParser());

  // ---- Request logging ----
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info({ method: req.method, url: req.url }, 'incoming request');
    next();
  });

  // ---- API routes (with rate limiting) ----
  app.use('/api/auth', apiLimiter, authRoutes);
  app.use('/api/deliveries', apiLimiter, deliveriesRoutes);
  app.use('/api/routes', apiLimiter, routesRoutes);
  app.use('/api/metrics', apiLimiter, metricsRoutes);
  app.use('/api/clients', apiLimiter, clientsRoutes);
  app.use('/api/fiados', apiLimiter, fiadosRoutes);

  // ---- Health check (no rate limit) ----
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  // ---- Global error handler ----
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, 'Unhandled error');

    const statusCode = err.statusCode || 500;
    const message =
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error';

    res.status(statusCode).json({
      message,
      ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  });

  return { app, logger };
}
