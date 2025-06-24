import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResendService } from './resend.service';
import { TwilioService } from './twilio.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [ResendService, TwilioService, CloudinaryService],
  exports: [ResendService, TwilioService, CloudinaryService],
})
export class CommonModule {}
