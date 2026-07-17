import { Response, NextFunction } from 'express';
import User from '../../features/auth/user.model.js';
import { AuthRequest } from '../types/express.js';
import { verifyToken } from '../../features/auth/auth.service.js';

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token =
    req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No autorizado', error: 'No autorizado' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: 'Token inválido o expirado', error: 'Token inválido o expirado' });
    return;
  }

  try {
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado', error: 'Usuario no encontrado' });
      return;
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      role: user.role,
    };

    next();
  } catch {
    res.status(500).json({ message: 'Error del servidor', error: 'Error del servidor' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Solo administradores pueden realizar esta acción' });
    return;
  }
  next();
};
