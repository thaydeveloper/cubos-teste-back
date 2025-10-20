import { Router } from "express";
import { EmailController } from "@/controllers/emailController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const router = Router();

// Teste de envio de e-mail
router.post("/test", authMiddleware, EmailController.sendTestEmail);

// Verificar lembretes manualmente
router.post("/check-reminders", authMiddleware, EmailController.checkReminders);

// Reenviar e-mail de boas-vindas
router.post("/resend-welcome", authMiddleware, EmailController.resendWelcome);

export default router;
