import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperationalAlertsController } from './operational-alerts.controller';
import { OperationalAlertsService } from './operational-alerts.service';
import { OperationalAlert, OperationalAlertSchema } from './schemas/operational-alert.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OperationalAlert.name, schema: OperationalAlertSchema }
    ])
  ],
  controllers: [OperationalAlertsController],
  providers: [OperationalAlertsService],
  exports: [OperationalAlertsService, MongooseModule],
})
export class OperationalAlertsModule {}
