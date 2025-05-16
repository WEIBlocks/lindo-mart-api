import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../schemas/item/item.schema';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  /**
   * Create a new item
   */
  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = new this.itemModel(createItemDto);
    return newItem.save();
  }

  /**
   * Get all items with optional filters
   */
  async findAll(filters: any = {}): Promise<Item[]> {
    return this.itemModel.find(filters).sort({ createdAt: -1 }).exec();
  }

  /**
   * Get items that need action
   */
  async findActionNeeded(): Promise<Item[]> {
    return this.itemModel
      .find({ actionNeeded: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Get a single item by ID
   */
  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    return item;
  }

  /**
   * Update an item
   */
  async update(id: string, updateData: Partial<CreateItemDto>): Promise<Item> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedItem) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }

    return updatedItem;
  }

  /**
   * Delete an item
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.itemModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    return { deleted: true };
  }
}
