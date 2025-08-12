import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import {
  htmlPetFoundNotification,
  htmlSendResetPasswordUrl,
} from './utils/emailTemplates';

export interface SendMailOptions {
  to: string;
  subject: string;
}

export interface FoundPetInfo {
  petName: string;
  ownerName: string;
  ownerPhone: string;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {}

  private transporter: Transporter = nodemailer.createTransport({
    service: this.configService.get<string>('MAILER_SERVICE'),
    auth: {
      user: this.configService.get<string>('MAILER_EMAIL'),
      pass: this.configService.get<string>('MAILER_SECRET_KEY'),
    },
  });

  async sendResetPasswordEmail(
    options: SendMailOptions,
    url: string,
  ): Promise<void> {
    const { to, subject } = options;

    const htmlBody = htmlSendResetPasswordUrl(url);

    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
      });
    } catch (error) {
      this.logger.error(`Error sending reset password email to ${to}:`, error);
      throw new Error('Failed to send reset password email');
    }
  }

  async sendFoundPetNotification(
    options: SendMailOptions,
    foundPetInfo: FoundPetInfo,
  ) {
    const { to, subject } = options;
    const { petName, ownerName, ownerPhone } = foundPetInfo;

    const htmlBody = htmlPetFoundNotification(petName, ownerName, ownerPhone);

    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
      });
    } catch (error) {
      this.logger.error(
        `Error sending found notification email to ${to}:`,
        error,
      );
      throw new Error('Failed to send found notification email');
    }
  }
}
