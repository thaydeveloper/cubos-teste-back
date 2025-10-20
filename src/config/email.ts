import nodemailer from "nodemailer";

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  static async initialize(): Promise<void> {
    const service = process.env.EMAIL_SERVICE || "mailhog";

    switch (service.toLowerCase()) {
      case "mailhog":
        this.transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || "localhost",
          port: parseInt(process.env.EMAIL_PORT || "1025"),
          ignoreTLS: true,
        });
        break;

      case "ethereal":
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        break;

      default:
        // SMTP personalizado
        this.transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || "localhost",
          port: parseInt(process.env.EMAIL_PORT || "587"),
          secure: process.env.EMAIL_PORT === "465",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
    }
  }

  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.transporter) {
        throw new Error("Email transporter not initialized");
      }

      const from = process.env.EMAIL_FROM || "noreply@movies-app.com";

      const info = await this.transporter.sendMail({
        from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });

      // Se for ethereal, mostrar URL de preview apenas em desenvolvimento
      if (
        process.env.EMAIL_SERVICE === "ethereal" &&
        process.env.NODE_ENV === "development"
      ) {
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
      }

      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  static async verifyConnection(): Promise<boolean> {
    try {
      if (this.transporter) {
        await this.transporter.verify();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Email service verification failed:", error);
      return false;
    }
  }
}
