import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio.service';
import { SendGridService } from './sendgrid.service';

@Module({
  imports: [ConfigModule],
  providers: [TwilioService, SendGridService],
  exports: [TwilioService, SendGridService],
})
export class CommonModule {}
