import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;
  private readonly logger = new Logger(TwilioService.name);

  constructor(private configService: ConfigService) {
    const accountSid =
      this.configService.get<string>('TWILIO_ACCOUNT_SID') ||
      process.env.TWILIO_ACCOUNT_SID;
    const authToken =
      this.configService.get<string>('TWILIO_AUTH_TOKEN') ||
      process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
      this.logger.log('Twilio service initialized successfully');
    } else {
      this.logger.warn(
        'Twilio credentials not provided - SMS functionality disabled'
      );
    }
  }

  async sendSMS(to: string, body: string): Promise<void> {
    if (!this.twilioClient) {
      this.logger.warn('Twilio not configured - SMS not sent');
      return;
    }

    try {
      const from =
        this.configService.get<string>('TWILIO_PHONE_NUMBER') ||
        process.env.TWILIO_PHONE_NUMBER;

      if (!from) {
        this.logger.error('TWILIO_PHONE_NUMBER not configured');
        throw new Error('Twilio phone number not configured');
      }

      const message = await this.twilioClient.messages.create({
        body,
        from,
        to,
      });

      this.logger.log(`SMS sent successfully to ${to}. SID: ${message.sid}`);
    } catch (error) {
      this.logger.error('Error sending SMS:', error);
      throw error;
    }
  }

  async sendBulkSMS(recipients: string[], body: string): Promise<void> {
    if (!this.twilioClient) {
      this.logger.warn('Twilio not configured - Bulk SMS not sent');
      return;
    }

    const promises = recipients.map((recipient) =>
      this.sendSMS(recipient, body).catch((error) =>
        this.logger.error(`Failed to send SMS to ${recipient}:`, error)
      )
    );

    await Promise.all(promises);
    this.logger.log(`Bulk SMS sent to ${recipients.length} recipients`);
  }

  // Helper method to validate phone number format
  isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation (you can enhance this)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
  }

  // Method to format phone number for Twilio
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let formatted = phoneNumber.replace(/[^\d+]/g, '');

    // Add + if not present
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }

    return formatted;
  }
}
