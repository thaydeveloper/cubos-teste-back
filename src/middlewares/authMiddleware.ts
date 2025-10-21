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
    console.log("🔐 Auth middleware - Headers recebidos:", {
      authorization: req.headers.authorization,
      origin: req.headers.origin,
      method: req.method,
      url: req.url,
    });

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Auth middleware - Token não encontrado ou inválido");
      throw new AppError("Token de acesso requerido", 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    console.log(
      "🔑 Auth middleware - Token extraído:",
      token.substring(0, 20) + "..."
    );

    const payload = verifyAccessToken(token);
    console.log(
      "✅ Auth middleware - Token válido para usuário:",
      payload.userId
    );

    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  } catch (error) {
    console.log(
      "❌ Auth middleware - Erro:",
      error instanceof Error ? error.message : String(error)
    );
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Token inválido", 401));
  }
};
