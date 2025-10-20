import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt";
import { AppError } from "@/middlewares/errorHandler";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token de acesso requerido", 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    const payload = verifyAccessToken(token);

    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Token inválido", 401));
  }
};
