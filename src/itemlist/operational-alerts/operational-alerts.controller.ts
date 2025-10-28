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
import { OperationalAlertsService } from './operational-alerts.service';
import { CreateOperationalAlertDto } from './dto/create-operational-alert.dto';
import { UpdateOperationalAlertDto } from './dto/update-operational-alert.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('itemlist/operational-alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class OperationalAlertsController {
  constructor(
    private readonly operationalAlertsService: OperationalAlertsService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOperationalAlertDto: CreateOperationalAlertDto) {
    return this.operationalAlertsService
      .create(createOperationalAlertDto)
      .then((alert) => ({
        success: true,
        message: 'Operational alert created successfully',
      }));
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('actionNeeded') actionNeeded?: string,
    @Query('type') type?: string
  ) {
    // Build filters object
    const filters: any = {};
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (actionNeeded) filters.actionNeeded = actionNeeded;
    if (type) filters.type = type;

    return this.operationalAlertsService
      .findAll(filters, page || 1, limit || 10, search)
      .then((result) => ({
        success: true,
        message: 'Operational alerts retrieved successfully',
        data: result.alerts,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.total,
          itemsPerPage: result.limit,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1,
        },
        filters: {
          search: search || null,
          category: category || null,
          subcategory: subcategory || null,
          actionNeeded: actionNeeded || null,
          type: type || null,
        },
      }));
  }

  @Get('stats')
  getOperationalAlertsStats(@Query('type') type?: string) {
    return this.operationalAlertsService
      .getOperationalAlertsStats(type)
      .then((stats) => ({
        success: true,
        message: 'Operational alerts statistics retrieved successfully',
        data: stats,
      }));
  }

  @Get('by-category/:category')
  findByCategory(@Param('category') category: string) {
    return this.operationalAlertsService
      .findAll({ category })
      .then((result) => ({
        success: true,
        message: `Operational alerts for category "${category}" retrieved successfully`,
        data: result.alerts,
        count: result.total,
      }));
  }

  @Get('by-subcategory/:subcategory')
  findBySubcategory(@Param('subcategory') subcategory: string) {
    return this.operationalAlertsService
      .findAll({ subcategory })
      .then((result) => ({
        success: true,
        message: `Operational alerts for subcategory "${subcategory}" retrieved successfully`,
        data: result.alerts,
        count: result.total,
      }));
  }

  @Get('by-action/:actionNeeded')
  findByActionNeeded(@Param('actionNeeded') actionNeeded: string) {
    return this.operationalAlertsService
      .findAll({ actionNeeded })
      .then((result) => ({
        success: true,
        message: `Operational alerts for action "${actionNeeded}" retrieved successfully`,
        data: result.alerts,
        count: result.total,
      }));
  }

  @Get('options/category')
  getCategoryOptions(@Query('type') type?: string) {
    return this.operationalAlertsService
      .getCategoryOptions(type)
      .then((options) => ({
        success: true,
        message: 'Category options retrieved successfully',
        data: options,
      }));
  }

  @Get('options/subcategory')
  getSubcategoryOptions(@Query('type') type?: string) {
    return this.operationalAlertsService
      .getSubcategoryOptions(type)
      .then((options) => ({
        success: true,
        message: 'Subcategory options retrieved successfully',
        data: options,
      }));
  }

  @Get('options/action-needed')
  getActionNeededOptions(@Query('type') type?: string) {
    return this.operationalAlertsService
      .getActionNeededOptions(type)
      .then((options) => ({
        success: true,
        message: 'Action needed options retrieved successfully',
        data: options,
      }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationalAlertsService.findOne(id).then((alert) => ({
      success: true,
      message: 'Operational alert retrieved successfully',
      data: alert,
    }));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOperationalAlertDto: UpdateOperationalAlertDto
  ) {
    return this.operationalAlertsService
      .update(id, updateOperationalAlertDto)
      .then((alert) => ({
        success: true,
        message: 'Operational alert updated successfully',
      }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationalAlertsService.remove(id).then(() => ({
      success: true,
      message: 'Operational alert deleted successfully',
    }));
  }
}
