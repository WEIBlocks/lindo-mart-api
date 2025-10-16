import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryItem, InventoryItemSchema } from './schemas/inventory.schema';
import { UnitOfMeasureController } from './common/unitOfMeasure/unit-of-measure.controller';
import { UnitOfMeasureService } from './common/unitOfMeasure/unit-of-measure.service';
import { UnitOfMeasure, UnitOfMeasureSchema } from './common/unitOfMeasure/schemas/unit-of-measure.schema';
import { PackagingController } from './common/packaging/packaging.controller';
import { PackagingService } from './common/packaging/packaging.service';
import { Packaging, PackagingSchema } from './common/packaging/schemas/packaging.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryItem.name, schema: InventoryItemSchema },
      { name: UnitOfMeasure.name, schema: UnitOfMeasureSchema },
      { name: Packaging.name, schema: PackagingSchema }
    ])
  ],
  controllers: [InventoryController, UnitOfMeasureController, PackagingController],
  providers: [InventoryService, UnitOfMeasureService, PackagingService],
  exports: [InventoryService, UnitOfMeasureService, PackagingService],
})
export class InventoryModule {}
