import nodemailer from "nodemailer";
import config from "./env.config";

export const transporter =
  config.email.user && config.email.password
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      })
    : null;

if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.warn("Email configuration warning:", error.message);
    } else {
      console.log("Email server ready");
    }
  });
} else {
  console.log("Email service disabled — no credentials provided");
}
