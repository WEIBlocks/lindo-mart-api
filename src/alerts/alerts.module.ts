import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from '../schemas/alert/alert.schema';
import { User, UserSchema } from '../schemas/user/user.schema';
import { UserModule } from '../user/user.module';
import { CommonModule } from 'src/common/common.module';
import { AlertsController } from './alerts.controller';
import { Form, FormSchema } from '../schemas/form/form.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    CommonModule,
  ],
  providers: [AlertsService],
  exports: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
