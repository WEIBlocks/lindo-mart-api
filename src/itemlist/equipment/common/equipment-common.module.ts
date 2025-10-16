import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasonCodeController } from './reasonCode/reason-code.controller';
import { ReasonCodeService } from './reasonCode/reason-code.service';
import { ReasonCode, ReasonCodeSchema } from './reasonCode/schemas/reason-code.schema';
import { ActionsController } from './actions/actions.controller';
import { ActionsService } from './actions/actions.service';
import { Actions, ActionsSchema } from './actions/schemas/actions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReasonCode.name, schema: ReasonCodeSchema },
      { name: Actions.name, schema: ActionsSchema }
    ])
  ],
  controllers: [ReasonCodeController, ActionsController],
  providers: [ReasonCodeService, ActionsService],
  exports: [ReasonCodeService, ActionsService, MongooseModule],
})
export class EquipmentCommonModule {}
