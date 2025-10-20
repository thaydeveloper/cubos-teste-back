import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/middlewares/authMiddleware";
import { CronService } from "@/services/cronService";
import { EmailService } from "@/config/email";
import { EmailTemplates } from "@/services/emailTemplates";
import { prisma } from "@/config/database";

export class EmailController {
  static async sendTestEmail(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      const testMovie = {
        title: "Filme de Teste",
        director: "Diretor Teste",
        genre: "Teste",
        duration: 120,
        rating: 8.5,
        releaseDate: new Date(),
        description:
          "Este é um filme de teste para validar o sistema de e-mails.",
        imageUrl:
          "https://via.placeholder.com/300x450/667eea/ffffff?text=Teste",
      };

      const template = EmailTemplates.movieReleaseReminder(testMovie, user);

      const emailSent = await EmailService.sendEmail({
        to: user.email,
        subject: `[TESTE] ${template.subject}`,
        html: template.html,
      });

      if (emailSent) {
        res.status(200).json({
          success: true,
          message: "E-mail de teste enviado com sucesso",
          data: {
            to: user.email,
            subject: template.subject,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Falha ao enviar e-mail de teste",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async checkReminders(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await CronService.checkMovieReleases();

      res.status(200).json({
        success: true,
        message: "Verificação de lembretes executada manualmente",
      });
    } catch (error) {
      next(error);
    }
  }

  static async resendWelcome(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      await CronService.sendWelcomeEmail(user);

      res.status(200).json({
        success: true,
        message: "E-mail de boas-vindas reenviado com sucesso",
        data: {
          to: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
