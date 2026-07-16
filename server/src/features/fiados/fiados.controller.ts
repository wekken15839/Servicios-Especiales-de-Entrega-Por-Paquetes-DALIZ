import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/express.js';
import { paymentSchema } from '../../shared/validation/schemas.js';
import { registerPayment } from './fiados.service.js';

export const registerPaymentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { clientId, amount, description } = parsed.data;
    const data = await registerPayment(clientId, req.user!.id, amount, description);
    res.status(201).json({ data });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};
