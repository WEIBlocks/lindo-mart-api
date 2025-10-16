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
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('itemlist/inventory/items')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto).then(item => ({
      success: true,
      message: 'Inventory item created successfully',
      data: item
    }));
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('perishable') perishable?: string,
    @Query('essential') essential?: string,
    @Query('status') status?: string,
    @Query('unitOfMeasure') unitOfMeasure?: string,
    @Query('unitsPerPackage') unitsPerPackage?: string
  ) {
    const filters: any = {};
    
    // Add filters based on query parameters
    if (perishable !== undefined) {
      filters.perishable = perishable === 'true';
    }
    if (essential !== undefined) {
      filters.essential = essential === 'true';
    }
    if (status) {
      filters.status = status;
    }
    if (unitOfMeasure) {
      filters.unitOfMeasure = unitOfMeasure;
    }
    if (unitsPerPackage) {
      filters.unitsPerPackage = unitsPerPackage;
    }

    return this.inventoryService.findAll(
      filters, 
      page || 1, 
      limit || 10, 
      search
    ).then(result => ({
      success: true,
      message: 'Inventory items retrieved successfully',
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
        perishable: perishable || null,
        essential: essential || null,
        status: status || null,
        unitOfMeasure: unitOfMeasure || null,
        unitsPerPackage: unitsPerPackage || null
      }
    }));
  }

  @Get('stats')
  getInventoryStats() {
    return this.inventoryService.getInventoryStats().then(stats => ({
      success: true,
      message: 'Inventory statistics retrieved successfully',
      data: stats
    }));
  }

  @Get('essential')
  findEssential() {
    return this.inventoryService.findAll({ essential: true }).then(result => ({
      success: true,
      message: 'Essential items retrieved successfully',
      data: result.items,
      count: result.total
    }));
  }

  @Get('perishable')
  findPerishable() {
    return this.inventoryService.findAll({ perishable: true }).then(result => ({
      success: true,
      message: 'Perishable items retrieved successfully',
      data: result.items,
      count: result.total
    }));
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.inventoryService.findAll({ status }).then(result => ({
      success: true,
      message: `Items with status '${status}' retrieved successfully`,
      data: result.items,
      count: result.total
    }));
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id).then(item => ({
      success: true,
      message: 'Inventory item retrieved successfully',
      data: item
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(id, updateInventoryDto).then(item => ({
      success: true,
      message: 'Inventory item updated successfully',
      data: item
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id).then(() => ({
      success: true,
      message: 'Inventory item deleted successfully',
      data: null
    }));
  }
}