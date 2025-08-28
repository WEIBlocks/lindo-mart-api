import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResendService } from './resend.service';
import { GmailService } from './gmail.service';
import { TwilioService } from './twilio.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [ResendService, GmailService, TwilioService, CloudinaryService],
  exports: [ResendService, GmailService, TwilioService, CloudinaryService],
})
export class CommonModule {}
