import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UnitOfMeasureService } from './unit-of-measure.service';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@Controller('itemlist/inventory/units-of-measure')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class UnitOfMeasureController {
  constructor(private readonly unitOfMeasureService: UnitOfMeasureService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUnitOfMeasureDto: CreateUnitOfMeasureDto) {
    return this.unitOfMeasureService.create(createUnitOfMeasureDto).then(() => ({
      success: true,
      message: 'Unit of measure created successfully'
    }));
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10
  ) {
    return this.unitOfMeasureService.findAll(page, limit).then(result => ({
      success: true,
      message: 'Units of measure retrieved successfully',
      data: result
    }));
  }

  @Get('options')
  getOptions() {
    return this.unitOfMeasureService.getOptions().then(options => ({
      success: true,
      message: 'Unit of measure options retrieved successfully',
      data: options
    }));
  }

  @Get('public')
  @UseGuards(JwtAuthGuard) // Only authentication, no role guard
  getPublicUnitsOfMeasure() {
    return this.unitOfMeasureService.getPublicUnitsOfMeasure().then(units => ({
      success: true,
      message: 'Units of measure retrieved successfully',
      data: units
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitOfMeasureService.findOne(id).then(unit => ({
      success: true,
      message: 'Unit of measure retrieved successfully',
      data: unit
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitOfMeasureDto: UpdateUnitOfMeasureDto) {
    return this.unitOfMeasureService.update(id, updateUnitOfMeasureDto).then(() => ({
      success: true,
      message: 'Unit of measure updated successfully'
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitOfMeasureService.remove(id).then(() => ({
      success: true,
      message: 'Unit of measure deleted successfully'
    }));
  }
}
