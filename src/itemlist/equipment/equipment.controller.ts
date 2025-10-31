import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  SetMetadata,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('itemlist/equipment/items')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto).then(item => ({
      success: true,
      message: 'Equipment item created successfully',
      data: item
    }));
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('location') location?: string
  ) {
    // Build filters object
    const filters: any = {};
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (location) filters.location = location;

    return this.equipmentService.findAll(
      filters, 
      page || 1, 
      limit || 10, 
      search
    ).then(result => ({
      success: true,
      message: 'Equipment items retrieved successfully',
      data: result.items,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
        hasNextPage: result.page < result.totalPages,
        hasPrevPage: result.page > 1
      },
      filters: {
        search: search || null,
        category: category || null,
        subcategory: subcategory || null,
        location: location || null
      }
    }));
  }

  @Get('stats')
  getEquipmentStats() {
    return this.equipmentService.getEquipmentStats().then(stats => ({
      success: true,
      message: 'Equipment statistics retrieved successfully',
      data: stats
    }));
  }

  @Get('by-category/:category')
  findByCategory(@Param('category') category: string) {
    return this.equipmentService.findAll({ category }).then(result => ({
      success: true,
      message: `Equipment items for category "${category}" retrieved successfully`,
      data: result.items,
      count: result.total
    }));
  }


  @Get('options/category')
  getCategoryOptions() {
    return this.equipmentService.getCategoryOptions().then(options => ({
      success: true,
      message: 'Category options retrieved successfully',
      data: options
    }));
  }

  @Get('options/subcategory')
  getSubcategoryOptions() {
    return this.equipmentService.getSubcategoryOptions().then(options => ({
      success: true,
      message: 'Subcategory options retrieved successfully',
      data: options
    }));
  }

  @Get('public')
  @UseGuards(JwtAuthGuard) // Override class-level guards - only requires authentication, no role restriction
  @SetMetadata('roles', []) // Explicitly set empty roles to bypass role restriction
  getPublicEquipmentItems(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string
  ) {
    return this.equipmentService.getPublicEquipmentItems(category, subcategory).then(items => ({
      success: true,
      message: 'Public equipment items retrieved successfully',
      data: items,
      filters: {
        category: category || null,
        subcategory: subcategory || null
      }
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id).then(item => ({
      success: true,
      message: 'Equipment item retrieved successfully',
      data: item
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, updateEquipmentDto).then(item => ({
      success: true,
      message: 'Equipment item updated successfully',
      data: item
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id).then(() => ({
      success: true,
      message: 'Equipment item deleted successfully',
      data: null
    }));
  }
}
