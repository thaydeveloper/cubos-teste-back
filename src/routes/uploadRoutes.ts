import { Router } from "express";
import { UploadController } from "@/controllers/uploadController";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { uploadSingle } from "@/middlewares/upload";

const router = Router();

// Upload de imagem
router.post("/", authMiddleware, uploadSingle, UploadController.uploadImage);

export default router;
