import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "@/middlewares/errorHandler";

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((err: any) => err.message).join(", ");
        return next(new AppError(`Dados inválidos: ${messages}`, 400));
      }
      next(error);
    }
  };
};
