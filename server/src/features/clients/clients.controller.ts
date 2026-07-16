import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/express.js';
import { createClientSchema, updateClientSchema } from '../../shared/validation/schemas.js';
import {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientBalance,
} from './clients.service.js';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await listClients(req.user!.id);
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
    const data = await getClientById(req.user!.id, req.params.id);
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
    const parsed = createClientSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const data = await createClient(req.user!.id, parsed.data);
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

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateClientSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const data = await updateClient(req.user!.id, req.params.id, parsed.data);
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

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteClient(req.user!.id, req.params.id);
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const getBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getClientBalance(req.user!.id, req.params.id);
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
