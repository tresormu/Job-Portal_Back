import { transporter } from "../config/Email";
import config from "../config/env.config";
import { welcomeEmail, passwordResetEmail, passwordChangedEmail } from "./emailTemplates";

class MailService {
  private from: string;

  constructor() {
    this.from = config.email.from || "noreply@jobportal.rw";
  }

  async sendWelcomeEmail(to: string, firstName: string) {
    if (!transporter) {
      console.warn("MailService: Transporter not configured. Welcome email not sent.");
      return;
    }

    try {
      await transporter.sendMail({
        from: this.from,
        to,
        subject: "Welcome to Job Portal!",
        html: welcomeEmail(firstName),
      });
      console.log(`Welcome email sent to: ${to}`);
    } catch (error) {
      console.error("MailService: Error sending welcome email:", error);
    }
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    if (!transporter) return;

    try {
      await transporter.sendMail({
        from: this.from,
        to,
        subject: "Password Reset Request",
        html: passwordResetEmail(resetUrl),
      });
    } catch (error) {
      console.error("MailService: Error sending password reset email:", error);
    }
  }

  async sendPasswordChangedEmail(to: string) {
    if (!transporter) return;

    try {
      await transporter.sendMail({
        from: this.from,
        to,
        subject: "Password Changed Successfully",
        html: passwordChangedEmail(),
      });
    } catch (error) {
      console.error("MailService: Error sending password change confirmation:", error);
    }
  }
}

export default new MailService();
