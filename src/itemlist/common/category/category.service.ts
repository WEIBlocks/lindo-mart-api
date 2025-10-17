import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) 
    private categoryModel: Model<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      // Check if category with same name and type already exists
      const existingCategory = await this.categoryModel.findOne({
        name: createCategoryDto.name,
        type: createCategoryDto.type
      });

      if (existingCategory) {
        throw new BadRequestException(`Category "${createCategoryDto.name}" already exists for type "${createCategoryDto.type}"`);
      }

      const newCategory = new this.categoryModel(createCategoryDto);
      return await newCategory.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        throw new BadRequestException(`Validation failed: ${validationErrors.join(', ')}`);
      }
      throw error;
    }
  }

  async findAll(type?: string, page: number = 1, limit: number = 10): Promise<{ 
    categories: Category[], 
    total: number, 
    page: number, 
    limit: number, 
    totalPages: number 
  }> {
    const skip = (page - 1) * limit;
    const query = type ? { type } : {};

    const [categories, total] = await Promise.all([
      this.categoryModel.find(query).select('_id name subcategories').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.categoryModel.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Check for duplicate name and type if updating name
    if (updateCategoryDto.name && updateCategoryDto.type) {
      const existingCategory = await this.categoryModel.findOne({
        name: updateCategoryDto.name,
        type: updateCategoryDto.type,
        _id: { $ne: id }
      });

      if (existingCategory) {
        throw new BadRequestException(`Category "${updateCategoryDto.name}" already exists for type "${updateCategoryDto.type}"`);
      }
    }

    // If subcategories are provided, remove duplicates
    if (updateCategoryDto.subcategories) {
      updateCategoryDto.subcategories = [...new Set(updateCategoryDto.subcategories)];
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }

  async getCategoriesByType(type: string): Promise<Category[]> {
    return this.categoryModel.find({ type }).sort({ name: 1 }).exec();
  }

  async getCategoryOptions(type: string): Promise<{ name: string; subcategories: string[] }[]> {
    const categories = await this.getCategoriesByType(type);
    return categories.map(cat => ({
      name: cat.name,
      subcategories: cat.subcategories
    }));
  }

  async getPublicCategories(type?: string): Promise<Category[]> {
    const query = type ? { type } : {};
    return this.categoryModel.find(query).select('_id name subcategories').sort({ createdAt: -1 }).exec();
  }

}
