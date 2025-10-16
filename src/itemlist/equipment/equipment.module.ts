import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { EquipmentItem, EquipmentItemSchema } from './schemas/equipment.schema';
import { EquipmentCommonModule } from './common/equipment-common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EquipmentItem.name, schema: EquipmentItemSchema }
    ]),
    EquipmentCommonModule
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService]
})
export class EquipmentModule {}
