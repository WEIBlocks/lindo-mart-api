import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio.service';
import { SendGridService } from './sendgrid.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [TwilioService, SendGridService, CloudinaryService],
  exports: [TwilioService, SendGridService, CloudinaryService],
})
export class CommonModule {}
