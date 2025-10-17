import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Packaging } from './schemas/packaging.schema';
import { CreatePackagingDto } from './dto/create-packaging.dto';
import { UpdatePackagingDto } from './dto/update-packaging.dto';

@Injectable()
export class PackagingService {
  constructor(
    @InjectModel(Packaging.name) 
    private packagingModel: Model<Packaging>
  ) {}

  async create(createPackagingDto: CreatePackagingDto): Promise<Packaging> {
    try {
      const newPackaging = new this.packagingModel(createPackagingDto);
      return await newPackaging.save();
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown field';
        throw new BadRequestException(`Duplicate entry found for field: ${duplicateField}. Please use a unique value.`);
      }
      throw new BadRequestException(`Failed to create packaging: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ items: Packaging[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.packagingModel.find().select('_id name').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.packagingModel.countDocuments().exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findOne(id: string): Promise<Packaging> {
    const packaging = await this.packagingModel.findById(id).select('_id name').exec();
    if (!packaging) {
      throw new NotFoundException(`Packaging with ID "${id}" not found`);
    }
    return packaging;
  }

  async update(id: string, updatePackagingDto: UpdatePackagingDto): Promise<Packaging> {
    try {
      const updatedPackaging = await this.packagingModel.findByIdAndUpdate(
        id,
        updatePackagingDto,
        { new: true, runValidators: true }
      ).exec();
      
      if (!updatedPackaging) {
        throw new NotFoundException(`Packaging with ID "${id}" not found`);
      }
      
      return updatedPackaging;
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown field';
        throw new BadRequestException(`Duplicate entry found for field: ${duplicateField}. Please use a unique value.`);
      }
      throw new BadRequestException(`Failed to update packaging: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.packagingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Packaging with ID "${id}" not found`);
    }
  }

  async getOptions(): Promise<{ value: string; label: string }[]> {
    const packagingList = await this.packagingModel.find().select('_id name').sort({ name: 1 }).exec();
    return packagingList.map(packaging => ({
      value: packaging._id.toString(),
      label: packaging.name
    }));
  }

  async getPublicPackaging(): Promise<any[]> {
    return this.packagingModel.find().select('_id name').sort({ createdAt: -1 }).exec();
  }
}
