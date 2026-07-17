import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/express.js';
import { getPrices, updatePrices } from './settings.service.js';
import { z } from 'zod';

const updatePricesSchema = z.object({
  mayor: z.number().int().min(0),
  detal: z.number().int().min(0),
});

export const getPricesHandler = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prices = await getPrices();
    res.json({ data: { prices } });
  } catch (error) {
    next(error);
  }
};

export const updatePricesHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updatePricesSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const data = await updatePrices(parsed.data);
    res.json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message, error: error.message });
      return;
    }
    next(error);
  }
};
