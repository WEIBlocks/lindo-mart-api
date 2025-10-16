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
      // Check if action with same description already exists
      const existingAction = await this.actionsModel.findOne({
        description: createActionsDto.description
      });

      if (existingAction) {
        throw new BadRequestException(`Action "${createActionsDto.description}" already exists`);
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

  async findAll(page: number = 1, limit: number = 10): Promise<{
    actions: Actions[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;

    const [actions, total] = await Promise.all([
      this.actionsModel.find().select('_id description').sort({ description: 1 }).skip(skip).limit(limit).exec(),
      this.actionsModel.countDocuments().exec()
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
    // Check for duplicate description if updating description
    if (updateActionsDto.description) {
      const existingAction = await this.actionsModel.findOne({
        description: updateActionsDto.description,
        _id: { $ne: id }
      });

      if (existingAction) {
        throw new BadRequestException(`Action "${updateActionsDto.description}" already exists`);
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

  async getPublicActions(): Promise<Actions[]> {
    return this.actionsModel.find().select('_id description').sort({ description: 1 }).exec();
  }
}
