import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/express.js';
import { createRouteSchema, visitWaypointSchema, updateRouteNotesSchema, updateWaypointNotesSchema } from '../../shared/validation/schemas.js';
import {
  listRoutes,
  getRouteById,
  createRoute,
  startRoute,
  pauseRoute,
  resumeRoute,
  markWaypointVisited,
  completeRoute,
  getRouteAnalysis,
  updateRouteNotes,
  updateWaypointNotes as updateWaypointNotesService,
} from './routes.service.js';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;
    const data = await listRoutes(req.user!.id, status as string | undefined);
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
    const data = await getRouteById(req.user!.id, req.params.id);
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
    const parsed = createRouteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const { name, deliveryIds, optimize } = parsed.data;
    const data = await createRoute(req.user!.id, name, deliveryIds, optimize);
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

export const start = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await startRoute(req.user!.id, req.params.id);
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

export const pause = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await pauseRoute(req.user!.id, req.params.id);
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

export const resume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await resumeRoute(req.user!.id, req.params.id);
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

export const markVisited = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = visitWaypointSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { packagesDelivered, packagesCount, paymentStatus, creditAmount, partialPayment, abonoAmount, abonoDescription } = parsed.data;
    const data = await markWaypointVisited(
      req.user!.id,
      req.params.id,
      req.params.deliveryId,
      packagesDelivered,
      packagesCount,
      paymentStatus,
      creditAmount,
      partialPayment,
      abonoAmount,
      abonoDescription
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

export const complete = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await completeRoute(req.user!.id, req.params.id);
    res.json({ data: result.route, analysis: result.analysis });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const getAnalysis = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getRouteAnalysis(req.user!.id, req.params.id);
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

export const updateNotes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateRouteNotesSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const data = await updateRouteNotes(req.user!.id, req.params.id, parsed.data.notes);
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

export const updateWaypointNotes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateWaypointNotesSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const data = await updateWaypointNotesService(
      req.user!.id,
      req.params.id,
      req.params.deliveryId,
      parsed.data.notes,
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
