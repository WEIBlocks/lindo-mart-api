import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>(process.env.SENDGRID_API_KEY));
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const from = process.env.SENDGRID_SENDER_EMAIL
    await sgMail.send({ to, from, subject, html });
  }
}
