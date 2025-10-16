import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnitOfMeasure } from './schemas/unit-of-measure.schema';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';

@Injectable()
export class UnitOfMeasureService {
  constructor(
    @InjectModel(UnitOfMeasure.name) 
    private unitOfMeasureModel: Model<UnitOfMeasure>
  ) {}

  async create(createUnitOfMeasureDto: CreateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    try {
      const newUnit = new this.unitOfMeasureModel(createUnitOfMeasureDto);
      return await newUnit.save();
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown field';
        throw new BadRequestException(`Duplicate entry found for field: ${duplicateField}. Please use a unique value.`);
      }
      throw new BadRequestException(`Failed to create unit of measure: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ items: UnitOfMeasure[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.unitOfMeasureModel.find().select('_id fullName shortName').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.unitOfMeasureModel.countDocuments().exec()
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

  async findOne(id: string): Promise<UnitOfMeasure> {
    const unit = await this.unitOfMeasureModel.findById(id).select('_id fullName shortName').exec();
    if (!unit) {
      throw new NotFoundException(`Unit of measure with ID "${id}" not found`);
    }
    return unit;
  }

  async update(id: string, updateUnitOfMeasureDto: UpdateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    try {
      const updatedUnit = await this.unitOfMeasureModel.findByIdAndUpdate(
        id,
        updateUnitOfMeasureDto,
        { new: true, runValidators: true }
      ).exec();
      
      if (!updatedUnit) {
        throw new NotFoundException(`Unit of measure with ID "${id}" not found`);
      }
      
      return updatedUnit;
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown field';
        throw new BadRequestException(`Duplicate entry found for field: ${duplicateField}. Please use a unique value.`);
      }
      throw new BadRequestException(`Failed to update unit of measure: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.unitOfMeasureModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Unit of measure with ID "${id}" not found`);
    }
  }

  async getOptions(): Promise<{ value: string; label: string }[]> {
    const units = await this.unitOfMeasureModel.find().select('_id fullName shortName').sort({ fullName: 1 }).exec();
    return units.map(unit => ({
      value: unit._id.toString(),
      label: `${unit.fullName} (${unit.shortName})`
    }));
  }

  async getPublicUnitsOfMeasure(): Promise<any[]> {
    return this.unitOfMeasureModel.find().select('_id fullName shortName description').sort({ fullName: 1 }).exec();
  }
}
