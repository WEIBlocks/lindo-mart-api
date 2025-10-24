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
import { ActionsService } from './actions.service';
import { CreateActionsDto } from './dto/create-actions.dto';
import { UpdateActionsDto } from './dto/update-actions.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('itemlist/common/actions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createActionsDto: CreateActionsDto) {
    return this.actionsService.create(createActionsDto).then(() => ({
      success: true,
      message: 'Action created successfully'
    }));
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('type') type?: string
  ) {
    return this.actionsService.findAll(page, limit, type).then(result => ({
      success: true,
      message: 'Actions retrieved successfully',
      data: result
    }));
  }

  @Get('public')
  @UseGuards(JwtAuthGuard) // Only authentication, no role guard
  getPublicActions(@Query('type') type?: string) {
    return this.actionsService.getPublicActions(type).then(actions => ({
      success: true,
      message: 'Actions retrieved successfully',
      data: actions
    }));
  }

  @Get('stats')
  getActionsStats() {
    return this.actionsService.getActionsStats().then(stats => ({
      success: true,
      message: 'Actions statistics retrieved successfully',
      data: stats
    }));
  }

  @Get('by-type/:type')
  findByType(@Param('type') type: string) {
    return this.actionsService.findAll(1, 100, type).then(result => ({
      success: true,
      message: `Actions for type "${type}" retrieved successfully`,
      data: result.actions,
      count: result.total
    }));
  }

  @Get('options/type')
  getTypeOptions() {
    return this.actionsService.getTypeOptions().then(options => ({
      success: true,
      message: 'Type options retrieved successfully',
      data: options
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionsService.findOne(id).then(action => ({
      success: true,
      message: 'Action retrieved successfully',
      data: action
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionsDto: UpdateActionsDto) {
    return this.actionsService.update(id, updateActionsDto).then(() => ({
      success: true,
      message: 'Action updated successfully'
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionsService.remove(id).then(() => ({
      success: true,
      message: 'Action deleted successfully'
    }));
  }
}
