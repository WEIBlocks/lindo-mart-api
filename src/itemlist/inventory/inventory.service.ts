import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryItem } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name) 
    private inventoryModel: Model<InventoryItem>
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<InventoryItem> {
    try {
      // First, clean up any old data with productId field
      await this.cleanupOldData();
      
      const newItem = new this.inventoryModel({
        ...createInventoryDto,
        lastUpdated: new Date()
      });
      
      return await newItem.save();
    } catch (error) {
      console.error('Create inventory error:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        throw new BadRequestException(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      if (error.code === 11000) {
        // Extract the field that caused the duplicate
        const duplicateField = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown field';
        throw new BadRequestException(`Duplicate entry found for field: ${duplicateField}. Please use a unique value.`);
      }
      
      throw new BadRequestException(`Failed to create inventory item: ${error.message}`);
    }
  }

  private async cleanupOldData() {
    try {
      // Remove productId field from any existing documents
      await this.inventoryModel.updateMany(
        { productId: { $exists: true } },
        { $unset: { productId: 1 } }
      );
      
      // Drop any existing indexes that might conflict
      try {
        await this.inventoryModel.collection.dropIndex('productId_1');
        console.log('✅ Dropped old productId index');
      } catch (error) {
        // Index might not exist, that's okay
      }
      
    } catch (error) {
      console.log('Cleanup error (non-critical):', error.message);
    }
  }

  async findAll(filters: any = {}, page: number = 1, limit: number = 10, search?: string): Promise<{ items: InventoryItem[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    // Build search query
    let query: any = { ...filters };
    
    if (search && search.trim()) {
      // Search in multiple fields: _id, name, description, reorderLevel
      const searchConditions: any[] = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { reorderLevel: { $regex: search.trim(), $options: 'i' } }
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
      this.inventoryModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.inventoryModel.countDocuments(query).exec()
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

  async findOne(id: string): Promise<InventoryItem> {
    const item = await this.inventoryModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Inventory item with ID "${id}" not found`);
    }
    return item;
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<InventoryItem> {
    const updatedItem = await this.inventoryModel.findByIdAndUpdate(
      id,
      { ...updateInventoryDto, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedItem) {
      throw new NotFoundException(`Inventory item with ID "${id}" not found`);
    }
    
    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.inventoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Inventory item with ID "${id}" not found`);
    }
  }

  async getInventoryStats(): Promise<any> {
    const total = await this.inventoryModel.countDocuments();
    const perishable = await this.inventoryModel.countDocuments({ perishable: true });
    const essential = await this.inventoryModel.countDocuments({ essential: true });
    const active = await this.inventoryModel.countDocuments({ status: 'active' });
    
    return {
      total,
      perishable,
      essential,
      active,
      inactive: total - active
    };
  }

  async getUnitOfMeasureOptions(): Promise<string[]> {
    return [
      'Pieces', 'Boxes', 'Cartons', 'Bags', 'Bottles', 'Cans', 
      'Packets', 'Rolls', 'Sheets', 'Units', 'Kilograms', 
      'Grams', 'Liters', 'Meters'
    ];
  }

  async getUnitsPerPackageOptions(): Promise<string[]> {
    return [
      '1', '2', '3', '4', '5', '6', '8', '10', '12', '15', '20', '24', 
      '25', '30', '36', '48', '50', '60', '72', '100', '120', '144', 
      '200', '250', '300', '500', '1000'
    ];
  }
}