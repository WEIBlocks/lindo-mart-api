import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { Form, FormSchema } from '../schemas/form/form.schema';
import { AlertsModule } from '../alerts/alerts.module';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    AlertsModule,
    UserModule,
    CommonModule,
  ],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService, MongooseModule],
})
export class FormsModule {}
