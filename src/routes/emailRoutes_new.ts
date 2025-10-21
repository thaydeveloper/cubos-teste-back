import { Router } from "express";
import { EmailController } from "@/controllers/emailController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Endpoints administrativos para gerenciamento de e-mails
 */

/**
 * @swagger
 * /api/email/test:
 *   post:
 *     tags: [Email]
 *     summary: Enviar e-mail de teste
 *     description: Envia um e-mail de teste para verificar a configuração do serviço
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: E-mail de teste enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "E-mail de teste enviado com sucesso"
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/test", authMiddleware, EmailController.sendTestEmail);

/**
 * @swagger
 * /api/email/check-reminders:
 *   post:
 *     tags: [Email]
 *     summary: Verificar lembretes manualmente
 *     description: Executa manualmente a verificação de filmes com data de lançamento hoje
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verificação executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verificação de lembretes executada manualmente"
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/check-reminders", authMiddleware, EmailController.checkReminders);

/**
 * @swagger
 * /api/email/resend-welcome:
 *   post:
 *     tags: [Email]
 *     summary: Reenviar e-mail de boas-vindas
 *     description: Reenvia o e-mail de boas-vindas para o usuário logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: E-mail reenviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "E-mail de boas-vindas reenviado com sucesso"
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/resend-welcome", authMiddleware, EmailController.resendWelcome);

export default router;
