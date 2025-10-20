import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET } from "@/config/aws";
import { AppError } from "@/middlewares/errorHandler";
import crypto from "crypto";
import path from "path";

export class UploadService {
  static generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const name = crypto.randomUUID();
    return `movies/${name}${ext}`;
  }

  static async uploadToS3(file: Express.Multer.File): Promise<string> {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new AppError("Credenciais AWS não configuradas", 500);
    }

    const fileName = this.generateFileName(file.originalname);

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await s3Client.send(command);

      const imageUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      return imageUrl;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new AppError("Erro no upload da imagem", 500);
    }
  }

  static async deleteFromS3(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.includes(S3_BUCKET)) {
      return;
    }

    try {
      const key = imageUrl.split(
        `${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`
      )[1];

      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error("S3 Delete Error:", error);
    }
  }

  static validateImageFile(file: Express.Multer.File): void {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimes.includes(file.mimetype)) {
      throw new AppError(
        "Tipo de arquivo não permitido. Use: JPEG, PNG ou WebP",
        400
      );
    }

    if (file.size > maxSize) {
      throw new AppError("Arquivo muito grande. Tamanho máximo: 5MB", 400);
    }
  }
}
