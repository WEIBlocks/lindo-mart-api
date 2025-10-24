import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { Category, CategorySchema } from './category/schemas/category.schema';
import { ActionsController } from './actions/actions.controller';
import { ActionsService } from './actions/actions.service';
import { Actions, ActionsSchema } from './actions/schemas/actions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Actions.name, schema: ActionsSchema }
    ])
  ],
  controllers: [CategoryController, ActionsController],
  providers: [CategoryService, ActionsService],
  exports: [CategoryService, ActionsService, MongooseModule],
})
export class ItemListCommonModule {}
