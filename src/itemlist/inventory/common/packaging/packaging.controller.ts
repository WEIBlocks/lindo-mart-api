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
import { PackagingService } from './packaging.service';
import { CreatePackagingDto } from './dto/create-packaging.dto';
import { UpdatePackagingDto } from './dto/update-packaging.dto';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@Controller('itemlist/inventory/packaging')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPackagingDto: CreatePackagingDto) {
    return this.packagingService.create(createPackagingDto).then(() => ({
      success: true,
      message: 'Packaging created successfully'
    }));
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10
  ) {
    return this.packagingService.findAll(page, limit).then(result => ({
      success: true,
      message: 'Packaging list retrieved successfully',
      data: result
    }));
  }

  @Get('options')
  getOptions() {
    return this.packagingService.getOptions().then(options => ({
      success: true,
      message: 'Packaging options retrieved successfully',
      data: options
    }));
  }

  @Get('public')
  @UseGuards(JwtAuthGuard) // Only authentication, no role guard
  getPublicPackaging() {
    return this.packagingService.getPublicPackaging().then(packaging => ({
      success: true,
      message: 'Packaging retrieved successfully',
      data: packaging
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagingService.findOne(id).then(packaging => ({
      success: true,
      message: 'Packaging retrieved successfully',
      data: packaging
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackagingDto: UpdatePackagingDto) {
    return this.packagingService.update(id, updatePackagingDto).then(() => ({
      success: true,
      message: 'Packaging updated successfully'
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagingService.remove(id).then(() => ({
      success: true,
      message: 'Packaging deleted successfully'
    }));
  }
}
