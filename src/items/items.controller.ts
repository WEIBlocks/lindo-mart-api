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
  ForbiddenException,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

// Define User interface
interface User {
  _id: string;
  username: string;
  role: string;
  email?: string;
}

@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @Roles('Super-Admin', 'Admin')
  async create(
    @Body() createItemDto: CreateItemDto,
    @CurrentUser() user: User
  ) {
    // Only Super-Admin and Admin can create items
    if (!['Super-Admin', 'Admin'].includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to create items'
      );
    }

    return this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.itemsService.findAll(query);
  }

  @Get('action-needed')
  async findActionNeeded() {
    return this.itemsService.findActionNeeded();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @Roles('Super-Admin', 'Admin')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: Partial<CreateItemDto>,
    @CurrentUser() user: User
  ) {
    // Only Super-Admin and Admin can update items
    if (!['Super-Admin', 'Admin'].includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to update items'
      );
    }

    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @Roles('Super-Admin')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    // Only Super-Admin can delete items
    if (user.role !== 'Super-Admin') {
      throw new ForbiddenException(
        'You do not have permission to delete items'
      );
    }

    return this.itemsService.remove(id);
  }
}
