import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReasonCode } from './schemas/reason-code.schema';
import { CreateReasonCodeDto } from './dto/create-reason-code.dto';
import { UpdateReasonCodeDto } from './dto/update-reason-code.dto';

@Injectable()
export class ReasonCodeService {
  constructor(
    @InjectModel(ReasonCode.name)
    private reasonCodeModel: Model<ReasonCode>
  ) {}

  async create(createReasonCodeDto: CreateReasonCodeDto): Promise<ReasonCode> {
    try {
      // Check if reason code with same name already exists
      const existingReasonCode = await this.reasonCodeModel.findOne({
        name: createReasonCodeDto.name
      });

      if (existingReasonCode) {
        throw new BadRequestException(`Reason code "${createReasonCodeDto.name}" already exists`);
      }

      const newReasonCode = new this.reasonCodeModel(createReasonCodeDto);
      return await newReasonCode.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        throw new BadRequestException(`Validation failed: ${validationErrors.join(', ')}`);
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    reasonCodes: ReasonCode[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;

    const [reasonCodes, total] = await Promise.all([
      this.reasonCodeModel.find().select('_id name description').sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.reasonCodeModel.countDocuments().exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reasonCodes,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findOne(id: string): Promise<ReasonCode> {
    const reasonCode = await this.reasonCodeModel.findById(id).exec();
    if (!reasonCode) {
      throw new NotFoundException(`Reason code with ID "${id}" not found`);
    }
    return reasonCode;
  }

  async update(id: string, updateReasonCodeDto: UpdateReasonCodeDto): Promise<ReasonCode> {
    // Check for duplicate name if updating name
    if (updateReasonCodeDto.name) {
      const existingReasonCode = await this.reasonCodeModel.findOne({
        name: updateReasonCodeDto.name,
        _id: { $ne: id }
      });

      if (existingReasonCode) {
        throw new BadRequestException(`Reason code "${updateReasonCodeDto.name}" already exists`);
      }
    }

    const updatedReasonCode = await this.reasonCodeModel.findByIdAndUpdate(
      id,
      updateReasonCodeDto,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedReasonCode) {
      throw new NotFoundException(`Reason code with ID "${id}" not found`);
    }

    return updatedReasonCode;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reasonCodeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reason code with ID "${id}" not found`);
    }
  }

  async getPublicReasonCodes(): Promise<ReasonCode[]> {
    return this.reasonCodeModel.find().select('_id name description').sort({ createdAt: -1 }).exec();
  }
}
