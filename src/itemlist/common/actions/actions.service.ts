import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Actions } from './schemas/actions.schema';
import { CreateActionsDto } from './dto/create-actions.dto';
import { UpdateActionsDto } from './dto/update-actions.dto';

@Injectable()
export class ActionsService {
  constructor(
    @InjectModel(Actions.name)
    private actionsModel: Model<Actions>
  ) {}

  async create(createActionsDto: CreateActionsDto): Promise<Actions> {
    try {
      // Check if action with same description and type already exists
      const existingAction = await this.actionsModel.findOne({
        description: createActionsDto.description,
        type: createActionsDto.type
      });

      if (existingAction) {
        throw new BadRequestException(`Action "${createActionsDto.description}" already exists for type "${createActionsDto.type}"`);
      }

      const newAction = new this.actionsModel(createActionsDto);
      return await newAction.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        throw new BadRequestException(`Validation failed: ${validationErrors.join(', ')}`);
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, type?: string): Promise<{
    actions: Actions[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;
    const query = type ? { type } : {};

    const [actions, total] = await Promise.all([
      this.actionsModel.find(query).select('_id description type').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.actionsModel.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      actions,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findOne(id: string): Promise<Actions> {
    const action = await this.actionsModel.findById(id).exec();
    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
    return action;
  }

  async update(id: string, updateActionsDto: UpdateActionsDto): Promise<Actions> {
    // Check for duplicate description and type if updating
    if (updateActionsDto.description && updateActionsDto.type) {
      const existingAction = await this.actionsModel.findOne({
        description: updateActionsDto.description,
        type: updateActionsDto.type,
        _id: { $ne: id }
      });

      if (existingAction) {
        throw new BadRequestException(`Action "${updateActionsDto.description}" already exists for type "${updateActionsDto.type}"`);
      }
    }

    const updatedAction = await this.actionsModel.findByIdAndUpdate(
      id,
      updateActionsDto,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedAction) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }

    return updatedAction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.actionsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
  }

  async getPublicActions(type?: string): Promise<Actions[]> {
    const query = type ? { type } : {};
    return this.actionsModel.find(query).select('_id description type').sort({ description: 1 }).exec();
  }

  async getActionsStats(): Promise<any> {
    const total = await this.actionsModel.countDocuments();
    
    // Get unique types and their counts
    const typeStats = await this.actionsModel.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    return {
      total,
      typeStats
    };
  }

  async getTypeOptions(): Promise<string[]> {
    return ['equipment', 'operational-alerts'];
  }
}
