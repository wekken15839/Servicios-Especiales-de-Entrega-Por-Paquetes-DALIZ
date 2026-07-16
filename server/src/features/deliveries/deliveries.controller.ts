import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/express.js';
import { DeliveryStatus } from './deliveries.types.js';
import { createDeliverySchema } from '../../shared/validation/schemas.js';
import {
  listDeliveries,
  getDeliveryById,
  createDelivery,
  deleteDelivery,
  updateDeliveryStatus,
} from './deliveries.service.js';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;
    const data = await listDeliveries(req.user!.id, status as string | undefined);
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

export const getById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getDeliveryById(req.user!.id, req.params.id);
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

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createDeliverySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const data = await createDelivery(req.user!.id, parsed.data);
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

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteDelivery(req.user!.id, req.params.id);
    res.json({ message: 'Entrega eliminada exitosamente' });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const updateStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const data = await updateDeliveryStatus(
      req.user!.id,
      req.params.id,
      status as DeliveryStatus
    );
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
