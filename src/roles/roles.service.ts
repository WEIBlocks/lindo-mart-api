import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async assignRole(userId: string, role: string) {
    console.log('userId', userId);
    console.log('role', role);
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.role = role;
    return user.save();
  }
}
