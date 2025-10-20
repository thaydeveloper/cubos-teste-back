import cron from "node-cron";
import { EmailService } from "@/config/email";
import { EmailTemplates } from "@/services/emailTemplates";
import { prisma } from "@/config/database";

export class CronService {
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Verificar e enviar lembretes de filmes todos os dias às 9:00
    cron.schedule("0 9 * * *", async () => {
      await this.checkMovieReleases();
    });

    this.isInitialized = true;
  }

  static async checkMovieReleases(): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const moviesReleasedToday = await prisma.movie.findMany({
        where: {
          releaseDate: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          user: true,
        },
      });

      for (const movie of moviesReleasedToday) {
        await this.sendMovieReleaseReminder(movie);
      }
    } catch (error) {
      console.error("Erro ao verificar lançamentos de filmes:", error);
    }
  }

  static async sendMovieReleaseReminder(movie: any): Promise<void> {
    try {
      const template = EmailTemplates.movieReleaseReminder(movie, movie.user);

      const emailSent = await EmailService.sendEmail({
        to: movie.user.email,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      console.error(`Erro ao enviar lembrete do filme ${movie.title}:`, error);
    }
  }

  static async sendWelcomeEmail(user: any): Promise<void> {
    try {
      const template = EmailTemplates.welcomeUser(user);

      await EmailService.sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail de boas-vindas:", error);
    }
  }

  static async sendMovieAddedNotification(
    movie: any,
    user: any
  ): Promise<void> {
    try {
      const template = EmailTemplates.movieAddedNotification(movie, user);

      await EmailService.sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      console.error("Erro ao enviar notificação de filme adicionado:", error);
    }
  }
}
