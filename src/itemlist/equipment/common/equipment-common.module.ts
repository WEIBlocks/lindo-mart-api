import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasonCodeController } from './reasonCode/reason-code.controller';
import { ReasonCodeService } from './reasonCode/reason-code.service';
import { ReasonCode, ReasonCodeSchema } from './reasonCode/schemas/reason-code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReasonCode.name, schema: ReasonCodeSchema }
    ])
  ],
  controllers: [ReasonCodeController],
  providers: [ReasonCodeService],
  exports: [ReasonCodeService, MongooseModule],
})
export class EquipmentCommonModule {}
