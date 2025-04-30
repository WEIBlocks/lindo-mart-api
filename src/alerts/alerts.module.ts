import { Module, forwardRef } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from '../schemas/alert/alert.schema';
import { User, UserSchema } from '../schemas/user/user.schema';
import { UserModule } from '../user/user.module';
import { CommonModule } from 'src/common/common.module';
import { AlertsController } from './alerts.controller';
import { Form, FormSchema } from '../schemas/form/form.schema';
import { JwtModule } from '@nestjs/jwt';
import { AlertsGateway } from './alerts.gateway';
import { TwilioService } from '../common/twilio.service';
import { SendGridService } from '../common/sendgrid.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    CommonModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AlertsService, AlertsGateway, TwilioService, SendGridService],
  exports: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
