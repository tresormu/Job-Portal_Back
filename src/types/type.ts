import type { Request } from "express";

export interface AuthUser {
  id: string;
  role: string;
  email?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface JwtPayload {
  id: string;
  role: string;
  userType?: string;
  iat?: number;
  exp?: number;
}
