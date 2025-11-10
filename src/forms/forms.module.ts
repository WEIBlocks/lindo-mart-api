import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { FormsMetadataService } from './forms-metadata.service';
import { Form, FormSchema } from '../schemas/form/form.schema';
import { AlertsModule } from '../alerts/alerts.module';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { InventoryModule } from '../itemlist/inventory/inventory.module';
import { EquipmentCommonModule } from '../itemlist/equipment/common/equipment-common.module';
import { ItemListCommonModule } from '../itemlist/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    AlertsModule,
    UserModule,
    CommonModule,
    InventoryModule,
    EquipmentCommonModule,
    ItemListCommonModule,
  ],
  controllers: [FormsController],
  providers: [FormsService, FormsMetadataService],
  exports: [FormsService, MongooseModule],
})
export class FormsModule {}
