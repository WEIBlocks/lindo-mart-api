import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;

  constructor(private configService: ConfigService) {
    this.twilioClient = new Twilio(
      this.configService.get<string>(process.env.TWILIO_ACCOUNT_SID),
      this.configService.get<string>(process.env.TWILIO_AUTH_TOKEN)
    );
  }
  
  
  async sendSMS(to: string, body: string): Promise<void> {
    const from = process.env.TWILIO_PHONE_NUMBER
    await this.twilioClient.messages.create({ body, from, to });
  }
}
