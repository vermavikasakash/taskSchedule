import { Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";

export const requireSignIn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = JWT.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthRequest["user"]; //  type cast

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 1) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};