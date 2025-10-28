import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OperationalAlert } from './schemas/operational-alert.schema';
import { CreateOperationalAlertDto } from './dto/create-operational-alert.dto';
import { UpdateOperationalAlertDto } from './dto/update-operational-alert.dto';

@Injectable()
export class OperationalAlertsService {
  constructor(
    @InjectModel(OperationalAlert.name)
    private operationalAlertModel: Model<OperationalAlert>
  ) {}

  async create(createOperationalAlertDto: CreateOperationalAlertDto): Promise<OperationalAlert> {
    try {
      const newAlert = new this.operationalAlertModel(createOperationalAlertDto);
      return await newAlert.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        throw new BadRequestException(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      if (error.code === 11000) {
        const duplicateField = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown field';
        throw new BadRequestException(`Duplicate entry found for field: ${duplicateField}. Please use a unique value.`);
      }
      
      throw new BadRequestException(`Failed to create operational alert: ${error.message}`);
    }
  }

  async findAll(filters: any = {}, page: number = 1, limit: number = 10, search?: string): Promise<{
    alerts: OperationalAlert[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;
    
    // Build search query
    let query: any = { ...filters };
    
    if (search && search.trim()) {
      // Search in multiple fields: _id, itemName, description, category, subcategory, actionNeeded
      const searchConditions: any[] = [
        { itemName: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { subcategory: { $regex: search.trim(), $options: 'i' } },
        { actionNeeded: { $regex: search.trim(), $options: 'i' } }
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

    const [alerts, total] = await Promise.all([
      this.operationalAlertModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.operationalAlertModel.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      alerts,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findOne(id: string): Promise<OperationalAlert> {
    const alert = await this.operationalAlertModel.findById(id).exec();
    if (!alert) {
      throw new NotFoundException(`Operational alert with ID "${id}" not found`);
    }
    return alert;
  }

  async update(id: string, updateOperationalAlertDto: UpdateOperationalAlertDto): Promise<OperationalAlert> {
    const updatedAlert = await this.operationalAlertModel.findByIdAndUpdate(
      id,
      updateOperationalAlertDto,
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedAlert) {
      throw new NotFoundException(`Operational alert with ID "${id}" not found`);
    }
    
    return updatedAlert;
  }

  async remove(id: string): Promise<void> {
    const result = await this.operationalAlertModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Operational alert with ID "${id}" not found`);
    }
  }

  async getOperationalAlertsStats(type?: string): Promise<any> {
    const query = type ? { type } : {};
    const total = await this.operationalAlertModel.countDocuments(query);
    
    // Get unique categories and their counts
    const categoryStats = await this.operationalAlertModel.aggregate([
      ...(type ? [{ $match: { type } }] : []),
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get unique subcategories and their counts
    const subcategoryStats = await this.operationalAlertModel.aggregate([
      ...(type ? [{ $match: { type } }] : []),
      { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    return {
      total,
      categoryStats,
      subcategoryStats
    };
  }

  async getCategoryOptions(type?: string): Promise<string[]> {
    // Get unique categories from the database
    const query = type ? { type } : {};
    const categories = await this.operationalAlertModel.distinct('category', query);
    return categories.sort();
  }

  async getSubcategoryOptions(type?: string): Promise<string[]> {
    // Get unique subcategories from the database
    const query = type ? { type } : {};
    const subcategories = await this.operationalAlertModel.distinct('subcategory', query);
    return subcategories.sort();
  }

  async getActionNeededOptions(type?: string): Promise<string[]> {
    // Get unique action needed options from the database
    const query = type ? { type } : {};
    const actions = await this.operationalAlertModel.distinct('actionNeeded', query);
    return actions.sort();
  }
}
