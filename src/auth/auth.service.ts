import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user/user.schema';
import { TwilioService } from '../common/twilio.service';
import { SendGridService } from '../common/sendgrid.service';
import { AlertsService } from '../alerts/alerts.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly twilioService: TwilioService,
    private readonly sendgridService: SendGridService,
    private readonly alertsService: AlertsService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user.toObject();
  }

  async login(loginDto: any) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    const payload = { username: user.username, sub: user._id, role: user.role };

    // Send SMS alert for successful login
    // if (user.phoneNumber) {
    //   await this.alertsService.sendAlert(
    //     'You have successfully logged in to Lindo Mart.',
    //     'Staff',
    //     user._id, // relatedId login user id
    //     user._id
    //   );
     
    //   console.log('SMS alert sent successfully');
    // }


    // Send email alert for successful login
    // if (user.email) {
    //   await this.sendgridService.sendEmail(
    //     user.email,
    //     'Login Alert',
    //     'You have successfully logged in to Lindo Mart.'  
    //   );
    //   console.log('Email alert sent successfully');
    // }

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(userDto: any) {
    const existingUser = await this.userModel
      .findOne({ username: userDto.username })
      .exec();
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);
    const newUser = new this.userModel({
      ...userDto,
      password: hashedPassword,
      role: 'Staff',
      phoneNumber: userDto.phoneNumber,
      email: userDto.email,
    });
    return newUser.save();
  }

  // async forgotPassword(email: string) {
  //   const user = await this.userModel.findOne({ email }).exec();
  //   if (!user) {
  //     throw new NotFoundException('User with this email does not exist');
  //   }
  //   const resetToken = crypto.randomBytes(32).toString('hex');
  //   const resetTokenHash = await bcrypt.hash(resetToken, 10);
  //   user.resetPasswordToken = resetTokenHash;
  //   user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  //   await user.save();
  //   // Send email with resetToken (e.g., using a mail service)
  //   return { message: 'Password reset link sent to email' };
  // }

  async resetPassword(userId: string, resetPasswordDto: any) {
    console.log(userId);
    const { oldPassword, newPassword } = resetPasswordDto;
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: 'Password has been changed successfully' };
  }
}
