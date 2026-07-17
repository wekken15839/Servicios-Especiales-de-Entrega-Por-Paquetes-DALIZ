import User, { IUserDocument } from './user.model.js';
import jwt from 'jsonwebtoken';
import { AuthResult } from './auth.types.js';
import { AppError } from '../../shared/errors/app-error.js';
import type { Env } from '../../shared/config/env.js';

let secret: string;

export function initAuth(env: Env): void {
  secret = env.JWT_SECRET;
}

const formatUser = (user: IUserDocument): AuthResult => ({
  id: user._id.toString(),
  username: user.username,
  name: user.name,
  role: user.role,
});

export const registerUser = async (data: {
  username: string;
  password: string;
  name: string;
  role?: string;
}): Promise<AuthResult> => {
  const existingUser = await User.findOne({ username: data.username });
  if (existingUser) {
    throw new AppError('El username ya está registrado', 400);
  }

  const user = await User.create(data);
  return formatUser(user);
};

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResult> => {
  const user = await User.findOne({ username }).select('+password');
  if (!user) {
    throw new AppError('Credenciales inválidas', 400);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Credenciales inválidas', 400);
  }

  return formatUser(user);
};

export const getUserById = async (userId: string): Promise<AuthResult> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  return formatUser(user);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch {
    return null;
  }
};
