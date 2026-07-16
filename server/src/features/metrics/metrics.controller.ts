import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/express.js';
import {
  getMetricsSummary,
  getMetricsEvolution,
  getMetricsInsights,
  getRealRevenue,
} from './metrics.service.js';
import { getDebtSummary, getDebtTrend } from '../fiados/fiados.service.js';
import { AppError } from '../../shared/errors/app-error.js';

const parseDateRange = (from?: string, to?: string): { from: Date; to: Date } => {
  const now = new Date();

  let fromDate: Date;
  let toDate: Date;

  if (to) {
    const p = to.split('-').map(Number);
    toDate = new Date(p[0], p[1] - 1, p[2], 23, 59, 59, 999);
  } else {
    toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }

  if (from) {
    const p = from.split('-').map(Number);
    fromDate = new Date(p[0], p[1] - 1, p[2], 0, 0, 0, 0);
  } else {
    const defaultFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    defaultFrom.setHours(0, 0, 0, 0);
    fromDate = defaultFrom;
  }

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new AppError('Formato de fecha inválido. Use YYYY-MM-DD', 400);
  }

  return { from: fromDate, to: toDate };
};

export const summary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, to } = parseDateRange(
      req.query.from as string | undefined,
      req.query.to as string | undefined
    );
    const data = await getMetricsSummary(req.user!.id, from, to);
    res.json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const evolution = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, to } = parseDateRange(
      req.query.from as string | undefined,
      req.query.to as string | undefined
    );
    const groupBy = (req.query.groupBy as string) || 'day';
    const data = await getMetricsEvolution(req.user!.id, from, to, groupBy);
    res.json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const insights = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, to } = parseDateRange(
      req.query.from as string | undefined,
      req.query.to as string | undefined
    );
    const data = await getMetricsInsights(req.user!.id, from, to);
    res.json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const debt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, to } = parseDateRange(
      req.query.from as string | undefined,
      req.query.to as string | undefined
    );
    const data = await getDebtSummary(req.user!.id, from, to);
    res.json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const debtTrend = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, to } = parseDateRange(
      req.query.from as string | undefined,
      req.query.to as string | undefined
    );
    const data = await getDebtTrend(req.user!.id, from, to);
    res.json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const revenueReal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, to } = parseDateRange(
      req.query.from as string | undefined,
      req.query.to as string | undefined
    );
    const data = await getRealRevenue(req.user!.id, from, to);
    res.json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};
