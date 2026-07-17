import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/express.js';
import { signUpSchema, signInSchema } from '../../shared/validation/schemas.js';
import {
  registerUser,
  loginUser,
  generateToken,
} from './auth.service.js';

const TOKEN_COOKIE = 'token';

const setTokenCookie = (res: Response, token: string): void => {
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const { username, password, name, role } = parsed.data;
    const user = await registerUser({ username, password, name, role });
    const token = generateToken(user.id);

    if (!req.user) {
      setTokenCookie(res, token);
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      ...(req.user ? {} : { token }),
    });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = signInSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const { username, password } = parsed.data;
    const user = await loginUser(username, password);
    const token = generateToken(user.id);

    setTokenCookie(res, token);

    res.json({
      message: 'Inicio de sesión exitoso',
      user,
      token,
    });
  } catch (error: any) {
    if (error.statusCode) {
      const msg = error.message;
      res.status(error.statusCode).json({ message: msg, error: msg });
      return;
    }
    next(error);
  }
};

export const logout = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  res.clearCookie(TOKEN_COOKIE);
  res.json({ message: 'Sesión cerrada exitosamente' });
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  res.json({ user: req.user });
};
