import { Request } from "express";

export interface AuthUser {
  _id: string;
  role: number;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}