import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AlertsService } from 'src/alerts/alerts.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly alertsService: AlertsService
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toObject();
  }

  async updateProfile(userId: string, updateProfileDto: any) {
    // Remove role from updateProfileDto if present
    const { role, ...updateData } = updateProfileDto;
    console.log(role);
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toObject();
  }

  async getRoles() {
    // Assuming roles are predefined
    return ['Staff', 'Supervisor', 'Management', 'Super-Admin'];
  }

  async updateRole(id: string, role: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.alertsService.sendAlert(
      `User ${user.username} role has been updated to ${role}`,
      user._id.toString(),
      user._id.toString(),
      user._id.toString(),
      null,
    );
    return user.toObject();
  }

  async getAllUsers() {
    return this.userModel.find().select('username role').exec();
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
