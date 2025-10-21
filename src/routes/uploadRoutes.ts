import { Router } from "express";
import { UploadController } from "@/controllers/uploadController";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { uploadSingle } from "@/middlewares/upload";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Endpoints para upload de arquivos
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     tags: [Upload]
 *     summary: Upload de imagem
 *     description: Faz upload de uma imagem para o AWS S3 e retorna a URL
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem (JPG, PNG, GIF, WebP)
 *           encoding:
 *             image:
 *               contentType: image/jpeg, image/png, image/gif, image/webp
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *             example:
 *               success: true
 *               data:
 *                 url: "https://mybucket.s3.amazonaws.com/uploads/1234567890-movie-poster.jpg"
 *                 filename: "1234567890-movie-poster.jpg"
 *       400:
 *         description: Arquivo inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Nenhum arquivo enviado"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: Arquivo muito grande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Arquivo muito grande. Tamanho máximo: 5MB"
 *       415:
 *         description: Tipo de arquivo não suportado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/image",
  authMiddleware,
  uploadSingle,
  UploadController.uploadImage
);

export default router;
