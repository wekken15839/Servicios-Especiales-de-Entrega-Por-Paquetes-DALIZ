import { Request } from 'express';

export interface IUserResponse {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: IUserResponse;
}
