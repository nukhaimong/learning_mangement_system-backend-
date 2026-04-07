import nodemailer from 'nodemailer';
import { envVars } from '../../config/env.js';
import path from 'path';
import ejs from 'ejs';
import AppError from '../errorHelpers/appError.js';
import status from 'http-status';

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_USER,
    pass: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_PASS,
  },
  port: Number(envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_PORT),
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, unknown>;
  attachment?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachment,
}: SendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachment?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`Email send to ${to}: ${info.messageId}`);
  } catch (error) {
    console.log('Email sending error: ', error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to send email');
  }
};
