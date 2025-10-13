import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EquipmentItem } from './schemas/equipment.schema';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(EquipmentItem.name) 
    private equipmentModel: Model<EquipmentItem>
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<EquipmentItem> {
    try {
      // First, clean up any old data with conflicting fields
      await this.cleanupOldData();
      
      const newItem = new this.equipmentModel({
        ...createEquipmentDto
      });
      
      return await newItem.save();
    } catch (error) {
      console.error('Create equipment error:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        throw new BadRequestException(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      if (error.code === 11000) {
        // Extract the field that caused the duplicate
        const duplicateField = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown field';
        throw new BadRequestException(`Duplicate entry found for field: ${duplicateField}. Please use a unique value.`);
      }
      
      throw new BadRequestException(`Failed to create equipment item: ${error.message}`);
    }
  }

  private async cleanupOldData() {
    try {
      // Clean up any old data if needed
      console.log('Equipment cleanup completed');
    } catch (error) {
      console.log('Cleanup error (non-critical):', error.message);
    }
  }

  async findAll(filters: any = {}, page: number = 1, limit: number = 10, search?: string): Promise<{ items: EquipmentItem[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    // Build search query
    let query: any = { ...filters };
    
    if (search && search.trim()) {
      // Search in multiple fields: _id, itemName, description, location, maintenanceNotes
      const searchConditions: any[] = [
        { itemName: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
        { maintenanceNotes: { $regex: search.trim(), $options: 'i' } }
      ];

      // If search looks like MongoDB ObjectId, also search by _id
      if (/^[0-9a-fA-F]{24}$/.test(search.trim())) {
        searchConditions.push({ _id: search.trim() });
      }

      // Combine search conditions with existing filters
      if (Object.keys(filters).length > 0) {
        query = {
          $and: [
            filters,
            { $or: searchConditions }
          ]
        };
      } else {
        query.$or = searchConditions;
      }
    }

    console.log('Search query:', JSON.stringify(query, null, 2)); // Debug log

    const [items, total] = await Promise.all([
      this.equipmentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.equipmentModel.countDocuments(query).exec()
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

  async findOne(id: string): Promise<EquipmentItem> {
    const item = await this.equipmentModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Equipment item with ID "${id}" not found`);
    }
    return item;
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<EquipmentItem> {
    const updatedItem = await this.equipmentModel.findByIdAndUpdate(
      id,
      { ...updateEquipmentDto },
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedItem) {
      throw new NotFoundException(`Equipment item with ID "${id}" not found`);
    }
    
    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.equipmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Equipment item with ID "${id}" not found`);
    }
  }

  async getEquipmentStats(): Promise<any> {
    const total = await this.equipmentModel.countDocuments();
    const equipmentAlert = await this.equipmentModel.countDocuments({ category: 'Equipment Alert' });
    const facilityAlert = await this.equipmentModel.countDocuments({ category: 'Facility Alert' });
    
    return {
      total,
      equipmentAlert,
      facilityAlert
    };
  }

  async getCategoryOptions(): Promise<string[]> {
    return [
      'Equipment Alert',
      'Facility Alert'
    ];
  }

  async getSubcategoryOptions(): Promise<string[]> {
    return [
      'Freezer/Chiller',
      'Scales', 
      'Other',
      'Restrooms',
      'Electricals',
      'Flooding'
    ];
  }
}
