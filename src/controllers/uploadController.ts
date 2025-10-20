import { Request, Response, NextFunction } from "express";
import { UploadService } from "@/services/uploadService";
import { AuthenticatedRequest } from "@/middlewares/authMiddleware";
import { AppError } from "@/middlewares/errorHandler";

export class UploadController {
  static async uploadImage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new AppError("Nenhuma imagem foi enviada", 400);
      }

      UploadService.validateImageFile(req.file);
      const imageUrl = await UploadService.uploadToS3(req.file);

      res.status(200).json({
        success: true,
        message: "Imagem enviada com sucesso",
        data: {
          imageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
