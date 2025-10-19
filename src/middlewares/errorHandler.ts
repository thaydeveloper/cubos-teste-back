import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  console.error(`[ERROR] ${req.method} ${req.path}:`, {
    message: error.message,
    stack: error.stack,
    statusCode,
    timestamp: new Date().toISOString(),
  });
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
      }),
    },
    timestamp: new Date().toISOString(),
  });
};
