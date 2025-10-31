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
  SetMetadata,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('itemlist/common/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto).then(() => ({
      success: true,
      message: 'Category created successfully'
    }));
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10
  ) {
    return this.categoryService.findAll(type, page, limit).then(result => ({
      success: true,
      message: 'Categories retrieved successfully',
      data: result
    }));
  }

  @Get('options')
  getOptions(@Query('type') type: string) {
    return this.categoryService.getCategoryOptions(type).then(options => ({
      success: true,
      message: 'Category options retrieved successfully',
      data: options
    }));
  }

  @Get('public')
  @UseGuards(JwtAuthGuard) // Override class-level guards - only requires authentication, no role restriction
  @SetMetadata('roles', []) // Explicitly set empty roles to bypass role restriction
  getPublicCategories(@Query('type') type?: string) {
    return this.categoryService.getPublicCategories(type).then(categories => ({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    }));
  }

  @Get('stats')
  getCategoryStats() {
    return this.categoryService.getCategoryStats().then(stats => ({
      success: true,
      message: 'Category statistics retrieved successfully',
      data: stats
    }));
  }

  @Get('by-type/:type')
  findByType(@Param('type') type: string) {
    return this.categoryService.getCategoriesByType(type).then(categories => ({
      success: true,
      message: `Categories for type "${type}" retrieved successfully`,
      data: categories
    }));
  }

  @Get('options/type')
  getTypeOptions() {
    return this.categoryService.getTypeOptions().then(options => ({
      success: true,
      message: 'Type options retrieved successfully',
      data: options
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id).then(category => ({
      success: true,
      message: 'Category retrieved successfully',
      data: category
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto).then(() => ({
      success: true,
      message: 'Category updated successfully'
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id).then(() => ({
      success: true,
      message: 'Category deleted successfully'
    }));
  }

}
