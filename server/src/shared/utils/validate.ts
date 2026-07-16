import { AppError } from '../errors/app-error.js';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export const requireFields = (body: Record<string, unknown>, fields: string[]): void => {
  for (const field of fields) {
    const value = body[field];
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`El campo '${field}' es obligatorio`);
    }
  }
};
